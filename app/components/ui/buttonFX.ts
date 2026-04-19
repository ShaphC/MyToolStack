export const buttonFX = {
  onMouseEnter: (e: any) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
  },
  onMouseLeave: (e: any) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
  },
  onMouseDown: (e: any) => {
    e.currentTarget.style.transform = "translateY(1px) scale(0.98)";
  },
  onMouseUp: (e: any) => {
    e.currentTarget.style.transform = "translateY(-2px) scale(1)";
  },
};