export default {
  id: "Modulation",
  title: "Modulation Techniques (AM, FM, PCM)",
  concept: `Modulation encodes information onto a carrier signal. AM varies amplitude, FM varies frequency, and PCM digitizes analog signals via sampling and quantization.`,
  steps: ["Define carrier parameters", "Apply message signal", "Observe modulated output", "Analyze noise resistance"],
  cliExamples: ["N/A - Physical Signal Layer"],
  practice: ["Observe the difference between AM and FM wave envelopes.", "Simulate the PCM process for a simple sine wave."],
  checks: [
    (model) => ({ ok: true, points: 100, remark: "Study the modulation theory and signal animations in the Experiment view." })
  ],
};
