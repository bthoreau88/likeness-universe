// GL-19R.1: Host-only behavioral test against byte-identical candidate C++ source.
// Fake Unreal interfaces: NOT UHT, NOT Unreal Engine 5.8, NOT gameplay.
#include "OVSNoiseListenerComponent.h"
#include <iostream>
#include <limits>
#include <stdexcept>
UWorld gWorld;
static int ntests = 0;
static void require(bool ok, const char* description){ if(!ok) throw std::runtime_error(description); ++ntests; }
int main() {
 try {
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.ReportNoise(25,FName("Gasp")); require(x.OnThresholdBreached.count==0,"disarmed event"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); x.ReportNoise(7.99f,FName("Quiet")); require(x.OnThresholdBreached.count==0,"ignore under 8"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; EOVSNoiseTier last=EOVSNoiseTier::Major; x.OnThresholdBreached.callback=[&](auto tier, auto, auto, auto){last=tier;}; x.Arm(); x.ReportNoise(8,FName("Exhale")); require(x.OnThresholdBreached.count==1 && last==EOVSNoiseTier::Minor,"minor at 8"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; EOVSNoiseTier last=EOVSNoiseTier::Minor; x.OnThresholdBreached.callback=[&](auto tier, auto, auto, auto){last=tier;}; x.Arm(); x.ReportNoise(20,FName("Gasp")); require(x.OnThresholdBreached.count==1 && last==EOVSNoiseTier::Major,"major at 20"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; EOVSNoiseTier last=EOVSNoiseTier::Major; x.OnThresholdBreached.callback=[&](auto tier, auto, auto, auto){last=tier;}; x.Arm(); x.ReportNoise(19.99f,FName("Exhale")); require(x.OnThresholdBreached.count==1 && last==EOVSNoiseTier::Minor,"below 20 minor"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); x.ReportNoise(std::numeric_limits<float>::quiet_NaN(),FName("NaN")); x.ReportNoise(std::numeric_limits<float>::infinity(),FName("Infinity")); require(x.OnThresholdBreached.count==0,"reject NaN and infinity"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); x.ReportNoise(10,FName("Exhale")); gWorld.time=1.199f; x.ReportNoise(10,FName("Exhale")); require(x.OnThresholdBreached.count==1,"refractory before 1.2s"); gWorld.time=1.2f; x.ReportNoise(10,FName("Exhale")); require(x.OnThresholdBreached.count==2,"refractory boundary 1.2s"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); x.ReportNoise(10,FName("Exhale")); x.Arm(); gWorld.time=0.5f; x.ReportNoise(10,FName("Exhale")); require(x.OnThresholdBreached.count==1,"idempotent arm prevents bypass"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); x.Deafen(1.5f); x.ReportNoise(20,FName("Gasp")); gWorld.time=1.49f; x.ReportNoise(20,FName("Gasp")); require(x.OnThresholdBreached.count==0,"deafen tail"); gWorld.time=1.5f; x.ReportNoise(20,FName("Gasp")); require(x.OnThresholdBreached.count==1,"deafen expiry"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); x.Deafen(1.5f); x.Disarm(); x.Arm(); gWorld.time=0.5f; x.ReportNoise(20,FName("Gasp")); require(x.OnThresholdBreached.count==0,"deafen persists through rearm"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); x.Disarm(); x.ReportNoise(25,FName("Gasp")); require(x.OnThresholdBreached.count==0,"disarmed after exit"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); x.OnThresholdBreached.callback=[&](auto,auto,auto,auto){x.ReportNoise(25,FName("Reentrant"));}; x.ReportNoise(10,FName("Exhale")); require(x.OnThresholdBreached.count==1,"reentrancy blocked"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); x.MinorThresholdDb=12; x.MajorThresholdDb=8; EOVSNoiseTier last=EOVSNoiseTier::Major; x.OnThresholdBreached.callback=[&](auto tier,auto,auto,auto){last=tier;}; x.ReportNoise(10,FName("BelowClampedMinor")); require(x.OnThresholdBreached.count==0,"misordered thresholds reject below minor"); x.ReportNoise(12,FName("ClampedMajor")); require(x.OnThresholdBreached.count==1 && last==EOVSNoiseTier::Major,"misordered thresholds safely clamp major"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; require(!x.IsArmed(),"initial disarmed"); x.Arm(); require(x.IsArmed(),"arm exposed"); x.Disarm(); require(!x.IsArmed(),"disarm exposed"); }
   { UOVSNoiseListenerComponent x; gWorld.time=0; x.Arm(); EOVSNoiseSource source=EOVSNoiseSource::Simulated; FName reason; x.OnThresholdBreached.callback=[&](auto,auto,auto src,auto why){source=src;reason=why;}; x.ReportNoise(12,FName("Hanger")); require(x.OnThresholdBreached.count==1 && source==EOVSNoiseSource::Simulated && reason.n=="Hanger","source and reason retained"); }
   std::cout << "HOST_SHIM_PASS checks=" << ntests << "; NOT_UE_COMPILATION\n";
   return 0;
 } catch(const std::exception& e){std::cerr << "HOST_SHIM_FAIL check=" << (ntests+1) << " message=" << e.what() << "\n"; return 1;}
}
