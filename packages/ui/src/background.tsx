export function Background() {
  return (
    <div style={styles.backgroundMain}>
      <div style={styles.backgroundMainBefore} />
      <div style={styles.backgroundMainAfter} />
      <div style={styles.backgroundContent} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  backgroundMain: {
    width: "100vw",
    minHeight: "100vh",
    position: "fixed",
    zIndex: -1,
    display: "flex",
    justifyContent: "center",
    padding: "120px 24px 160px 24px",
    pointerEvents: "none",
  },
  backgroundMainBefore: {
    background: "radial-gradient(circle, rgba(2, 0, 36, 0) 0, #fafafa 100%)",
    position: "absolute",
    content: '""',
    zIndex: 2,
    width: "100%",
    height: "100%",
    top: 0,
  },
  backgroundMainAfter: {
    content: '""',
    backgroundImage: "url(https://d2vwwcvoksz7ty.cloudfront.net/grid.svg)",
    zIndex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    opacity: 0.4,
    filter: "invert(1)",
  },
  backgroundContent: {
    zIndex: 3,
    width: "100%",
    maxWidth: "640px",
    backgroundImage: `radial-gradient(at 27% 37%, hsla(215, 50%, 81%, 1) 0px, transparent 0%), 
    radial-gradient(at 97% 21%, hsla(125, 50%, 82%, 1) 0px, transparent 50%),
    radial-gradient(at 52% 99%, hsla(354, 50%, 81%, 1) 0px, transparent 50%),
    radial-gradient(at 10% 29%, hsla(256, 50%, 87%, 1) 0px, transparent 50%),
    radial-gradient(at 97% 96%, hsla(38, 30%, 84%, 1) 0px, transparent 50%),
    radial-gradient(at 33% 50%, hsla(222, 35%, 83%, 1) 0px, transparent 50%),
    radial-gradient(at 79% 53%, hsla(343, 36%, 89%, 1) 0px, transparent 50%)`,
    position: "absolute",
    height: "100%",
    filter: "blur(100px) saturate(150%)",
    top: "80px",
    opacity: 0.15,
  },
};
