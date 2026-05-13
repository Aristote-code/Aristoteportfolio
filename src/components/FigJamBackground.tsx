export function FigJamBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 w-full pointer-events-none"
      style={{
        backgroundColor: "#fafafa",
        backgroundImage:
          "radial-gradient(circle, rgba(204, 204, 204, 0.55) 0.9px, transparent 0.9px)",
        backgroundSize: "20px 20px",
      }}
    />
  );
}
