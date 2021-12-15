// Elements
const $form = document.getElementById('form');
const $input = document.getElementById('input');
const $tableContainer = document.getElementById('table-container');
const $table = document.getElementById('table');
const $status = document.getElementById('status');

// These are the properties available for each Comment,
// by commenting out a row it'll be hidden in the Table, and vice-versa.
const keys = [
  // { value: "address1", label: "Address 1" },
  // { value: "address2", label: "Address 2" },
  // { value: "agencyId", label: "Agency ID" },
  { value: 'category', label: 'Category' },
  // { value: "city", label: "City" },
  { value: 'comment', label: 'Comment' },
  // { value: "commentOn", label: "Comment On" },
  { value: 'commentOnDocumentId', label: 'Comment On Document ID' },
  { value: 'country', label: 'Country' },
  // { value: "displayProperties", label: "Display Properties" },
  // { value: "docAbstract", label: "Doc Abstract" },
  { value: 'docketId', label: 'Docket ID' },
  { value: 'documentType', label: 'Document Type' },
  // { value: "duplicateComments", label: "Duplicate Comments" },
  { value: 'email', label: 'Email' },
  // { value: "fax", label: "Fax" },
  // { value: "field1", label: "Field 1" },
  // { value: "field2", label: "Field 2" },
  // { value: "fileFormats", label: "File Formats" },
  { value: 'firstName', label: 'First Name' },
  { value: 'govAgency', label: 'Gov Agency' },
  { value: 'govAgencyType', label: 'Gov Agency Type' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'legacyId', label: 'Legacy ID' },
  // { value: "modifyDate", label: "Modify Date" },
  // { value: "objectId", label: "Object ID" },
  // { value: "openForComment", label: "Open For Comment" },
  { value: 'organization', label: 'Organization' },
  { value: 'originalDocumentId', label: 'Original Document ID' },
  // { value: "pageCount", label: "Page Count" },
  { value: 'phone', label: 'Phone' },
  { value: 'postedDate', label: 'Posted Date' },
  // { value: "postmarkDate", label: "Postmark Date" },
  // { value: "reasonWithdrawn", label: "Reason Withdrawn" },
  { value: 'receiveDate', label: 'Receive Date' },
  // { value: "restrictReason", label: "Restrict Reason" },
  { value: 'restrictReasonType', label: 'Restrict Reason Type' },
  // { value: "stateProvinceRegion", label: "State Province Region" },
  // { value: "submitterRep", label: "Submitter Rep" },
  // { value: "submitterRepAddress", label: "Submitter Rep Address" },
  // { value: "submitterRepCityState", label: "Submitter Rep City State" },
  // { value: "subtype", label: "Subtype" },
  { value: 'title', label: 'Title' },
  // { value: "trackingNbr", label: "Tracking Number" },
  // { value: "withdrawn", label: "Withdrawn" },
  // { value: "zip", label: "Zip" },
];

const setupTable = () => {
  $table.innerHTML = '';
  const header = $table.createTHead();
  const row = header.insertRow(0);
  keys.forEach((key, index) => {
    const column = row.insertCell(index);
    column.innerHTML = key.label;
  });
  $table.createTBody();
  if (!$tableContainer.classList.contains('border-1px')) {
    $tableContainer.classList.add('border-1px');
  }
};

const addTableRow = (data) => {
  const $tbody = $table.getElementsByTagName('tbody')[0];
  const row = $tbody.insertRow();
  keys.forEach((key, index) => {
    const column = row.insertCell(index);
    column.innerHTML = data[key.value];
  });
};

const state = {
  clientId: null,
  documentId: '',
  status: 'default',
};

const setState = (status) => {
  state.status = `Status: ${status}`;
  $status.innerHTML = state.status;
  switch (status) {
    case 'Default':
      break;
    case 'Loading':
      setupTable();
      break;
    case 'Complete':
      break;
    default:
      break;
  }
  return null;
};

$form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const documentId = document.querySelector(`[name="documentId"]`).value;
  const { clientId } = state;

  if (documentId && clientId) {
    setState('Loading');
    fetch('/comments', {
      body: JSON.stringify({
        clientId: clientId,
        documentId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then((response) => response.json())
      .catch((error) => {
        setState('Default');
        console.error('Error:', error);
      });
  } else {
    console.log('documentId required');
  }
});

$input.addEventListener('input', (event) => {
  state.documentId = event.target.value;
});

(() => {
  const socket = io.connect('http://localhost:3000');
  socket.on('connect', () => {
    state.clientId = socket.id;
    console.log({ client: socket.id });
  });
  socket.on('comment', (data) => {
    addTableRow(data);
  });
  socket.on('complete', (data) => {
    const { error } = data;
    if (error) {
      setState(error.message);
    } else {
      setState('Complete');
    }
  });
})();
