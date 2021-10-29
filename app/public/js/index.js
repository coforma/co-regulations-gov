// elements
const $form = document.getElementById("form");
const $input = document.getElementById("input");
const $table = document.getElementById("table");
const $status = document.getElementById("status");

const state = {
  documentId: "",
  status: "default",
};

// set defaults
$status.innerHTML = `Status: ${state.status}`;

const addRow = (data) => {
  const row = $table.insertRow();
  [
    "address1",
    "address2",
    "agencyId",
    "category",
    "city",
    "comment",
    "commentOn",
    "commentOnDocumentId",
    "country",
    "displayProperties",
    "docAbstract",
    "docketId",
    "documentType",
    "duplicateComments",
    "email",
    "fax",
    "field1",
    "field2",
    "fileFormats",
    "firstName",
    "govAgency",
    "govAgencyType",
    "lastName",
    "legacyId",
    "modifyDate",
    "objectId",
    "openForComment",
    "organization",
    "originalDocumentId",
    "pageCount",
    "phone",
    "postedDate",
    "postmarkDate",
    "reasonWithdrawn",
    "receiveDate",
    "restrictReason",
    "restrictReasonType",
    "stateProvinceRegion",
    "submitterRep",
    "submitterRepAddress",
    "submitterRepCityState",
    "subtype",
    "title",
    "trackingNbr",
    "withdrawn",
    "zip",
  ].forEach((prop, index) => {
    const column = row.insertCell(index);
    column.innerHTML = data[prop];
  });
};

const setState = (status, data) => {
  state.status = `Status: ${status}`;

  $status.innerHTML = state.status;
  $table.style.visibility = "hidden";

  switch (status) {
    case "default":
      break;
    case "loading":
      break;
    case "result":
      $status.innerHTML = "Status: loading";
      $table.style.visibility = "visible";
      addRow(data);
      console.log(data);
      break;
    case "complete":
      $table.style.visibility = "visible";
      console.log("all loaded");
      break;
    default:
      break;
  }
  return null;
};

$form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const documentId = document.querySelector(`[name="documentId"]`).value;

  if (documentId) {
    setState("loading");
    fetch("/comments", {
      body: JSON.stringify({
        documentId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        console.log("Request Made");
      })
      .catch((error) => {
        setState("default");
        console.error("Error:", error);
      });
  } else {
    // TODO: Display required value message
  }
});

$input.addEventListener("input", (event) => {
  state.documentId = event.target.value;
});

(() => {
  const socket = io.connect("http://localhost:3000");
  socket.on("complete", () => setState("complete"));
  socket.on("result", (data) => setState("result", data));
})();
