export const errorStyle = {
  color: "red",
  alignSelf: "flex-end",
  paddingBottom: "10px",
  lineHeight: "3px",
};

export const statusBadge = {
  padding: "5px 10px",
  fontSize: "20px",
  borderRadius: "5px",
  display: "inline-block",
  margin: 0,
};

export const ticketNameStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: 0,
};

export const filesButtonStyle = {
  backgroundColor: "#ed8d21",
  borderRadius: "5px",
  color: "white",
  border: "none",
  padding: "6px",
};

export function LoaderShow() {
  var element = document.getElementById("hideloding");
  if (element !== null) {
    element.style.display = "flex";
  }
}

export function LoaderHide() {
  var element = document.getElementById("hideloding");

  if (element !== null) {
    element.style.display = "none";
  }
}
