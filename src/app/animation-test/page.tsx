import type { Metadata } from "next";
import { RobotAnimation } from "@/components/robot-animation";

export const metadata: Metadata = {
  title: "Animation Test - Robot Lottie",
  description: "Testing Lottie robot animation integration",
};

export default function AnimationTestPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-text-1">
          Robot Animation Test
        </h1>

        <div className="space-y-8">
          {/* Large Animation */}
          <section className="bg-surf-1 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-text-2">
              Large Size
            </h2>
            <div className="flex justify-center">
              <RobotAnimation className="w-full max-w-2xl" />
            </div>
          </section>

          {/* Medium Animation */}
          <section className="bg-surf-1 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-text-2">
              Medium Size
            </h2>
            <div className="flex justify-center">
              <RobotAnimation className="w-full max-w-lg" />
            </div>
          </section>

          {/* Small Animation */}
          <section className="bg-surf-1 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-text-2">
              Small Size
            </h2>
            <div className="flex justify-center">
              <RobotAnimation className="w-64" />
            </div>
          </section>

          {/* Side by Side */}
          <section className="bg-surf-1 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-text-2">
              Multiple Instances
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RobotAnimation className="w-full" />
              <RobotAnimation className="w-full" />
              <RobotAnimation className="w-full" />
            </div>
          </section>

          {/* Technical Details */}
          <section className="bg-surf-1 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-text-2">
              Animation Details
            </h2>
            <dl className="space-y-2 text-text-3">
              <div>
                <dt className="font-semibold inline">Source:</dt>
                <dd className="inline ml-2">
                  <code className="text-sm bg-surf-2 px-2 py-1 rounded">
                    https://lottie.host/f782f076-4669-487a-845c-b8e61ee54792/BOQ0OKnciK.lottie
                  </code>
                </dd>
              </div>
              <div>
                <dt className="font-semibold inline">Format:</dt>
                <dd className="inline ml-2">DotLottie (.lottie)</dd>
              </div>
              <div>
                <dt className="font-semibold inline">Package:</dt>
                <dd className="inline ml-2">@lottiefiles/dotlottie-react</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
