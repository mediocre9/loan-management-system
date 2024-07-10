/**
 * @todo Refactor the code
 * Priority-Level 2
 */

// The Employemnent Information Script Starts  here
var errorMessage = '';
var currentEmploymentDates = [];     // Its store only dates of current Emp 
var currentEmployementExists = false;


let defaultIncomeType = "salary"; //default  . . . .


function checkEmploymentHistory() {
    let totalEmploymentMonths = 0;
    currentEmploymentDates = [];

    let duration = 0;
    function calculateMonths(start, end) {
        let startDate = moment(start);
        let endDate = moment(end);
        duration = Math.round(endDate.diff(startDate, "months", true));
        return duration;
    }

    // Function to create additional employment block
    function createAdditionalEmploymentBlock() {
        let allFilled = true;
        document.querySelectorAll('.additionalEmploymentBlock').forEach(block => {
            const startDateInput = block.querySelector('.additionalStartDate').value;
            const endDateInput = block.querySelector('.additionalEndDate').value;
            const additionalEmployerName = block.querySelector('.additionalEmployerName').value;
            const additionalPosition = block.querySelector('.additionalPosition').value;

            if (startDateInput.length < 1 || endDateInput.length < 1 || additionalEmployerName.length < 1 || additionalPosition.length < 1) {
                allFilled = false;
                return;
            }
        });

        if (allFilled) {
            schoolTogl.style.display = "block";
            const additionalEmploymentBlock = document.createElement('div');
            additionalEmploymentBlock.className = 'additionalEmploymentBlock';
            additionalEmploymentBlock.innerHTML = `
            <strong class="strongSubHeading">Additional Employment</strong>
            <input type="text" class="additionalEmployerName" placeholder="Employer Name" onblur="ValidateInputs(this,event)"  />
            <input type="text" class="additionalPosition" placeholder="Position" onblur="ValidateInputs(this,event)"  />
            <div style="display: flex; align-items: center;">
                <input type="checkbox" name="" class="CurrenPositionCheck"
                    style="width: 17px; height: 20px; margin-right: 10px;" onchange="currentJob(this)" >
                <label for="CurrenPositionCheck">Current Position</label>
            </div>
            <input onfocus="(this.type='date')" onblur="ValidateInputs(this,event)"  class="additionalStartDate" placeholder="Start Date"  />
            <input onfocus="(this.type='date')" onblur="ValidateInputs(this,event)"  class="additionalEndDate" placeholder="End Date" />
            <p class="errorMessage"></p>
            `;
            document.getElementById('additionalEmploymentContainer').appendChild(additionalEmploymentBlock);
        }
    }

    // Get current date
    const currentDate = new Date();


    function calculateTotalEmploymentMonths() {
        let totalMonths = totalEmploymentMonths; // Start with current employment duration
        const additionalBlocks = Array.from(document.querySelectorAll('.additionalEmploymentBlock'));
        additionalBlocks.forEach((block, index) => {
            const startDateInput = block.querySelector('.additionalStartDate').value;
            const endDateInput = block.querySelector('.additionalEndDate').value;
            const isCurrentJob = block.querySelector('.CurrenPositionCheck').checked;

            if (startDateInput) {
                const startDate = new Date(startDateInput);
                const endDate = isCurrentJob ? currentDate : new Date(endDateInput);
                const duration = calculateMonths(startDate, endDate);
                totalMonths += duration;
                if (isCurrentJob) {
                    currentEmploymentDates.push({ startDate, endDate });
                }
            }
        });

        // console.log("calculateTotalEmploymentMonths");
        return totalMonths;
    }

    function validateAndContinue() {
        totalEmploymentMonths = calculateTotalEmploymentMonths();
        if (totalEmploymentMonths < 24) {
            createAdditionalEmploymentBlock();
        } else {
            schoolTogl.style.display = "none";
        }
    }

    validateAndContinue();
    return totalEmploymentMonths;
}


function ValidateInputs(Input, event) {
    let flag = true;
    document.querySelectorAll('.additionalEmploymentBlock').forEach(block => {
        const startDateInput = block.querySelector('.additionalStartDate').value;
        const borrowerName = block.querySelector(".additionalBorrowerName")?.value;
        const endDateInput = block.querySelector('.additionalEndDate').value;
        errorMessage = block.querySelector('.errorMessage');
        const startDate = new Date(startDateInput);
        const endDate = new Date(endDateInput);
        const currentDate = new Date();

        if (startDate > currentDate) { // Check if start date is greater than current date
            errorMessage.style.display = "block";
            errorMessage.innerText = "Start date cannot be in the future!";
            flag = false;
            return;
        } else if (endDate < startDate) { // Check if end date is lesser than start date
            errorMessage.style.display = "block";
            errorMessage.innerText = "End date cannot be before start date!";
            flag = false;
            return;
        } else {
            errorMessage.style.display = "none";
            errorMessage.innerText = "";
            flag = true;
        }
    });

    if (flag) {
        const ParentWraper = document.getElementById('additionalEmploymentContainer');
        const children = ParentWraper.children;
        const parentBox = event.target.parentElement;
        const currentIndex = Array.from(parentBox.parentNode.children).indexOf(parentBox);
        // checkEmploymentHistory();
        const NumberOfMonth = checkEmploymentHistory();
        if (NumberOfMonth > 24) {
            // if (children.length > currentIndex + 1) {
            // for (let i = currentIndex + 1; i < children.length; i++) {
            for (let i = currentIndex; i < children.length; i++) {
                // for (let i = 0; i < children.length; i++) {
                const block = children[i];
                const startDateInput = block.querySelector('.additionalStartDate').value;
                const endDateInput = block.querySelector('.additionalEndDate').value;
                const additionalEmployerName = block.querySelector('.additionalEmployerName').value;
                const additionalPosition = block.querySelector('.additionalPosition').value;

                if (startDateInput.length < 1 && endDateInput.length < 1 && additionalEmployerName.length < 1 && additionalPosition.length < 1) {
                    block.remove();
                }
            }
            // }
        }
    }
}

function toggleSchoolFields(checkbox) {
    const employmentBlocks = document.querySelectorAll('.additionalEmploymentBlock');
    const employmentBlock = employmentBlocks[employmentBlocks.length - 1];
    const schoolFieldsTemplate = document.getElementById('schoolFieldsTemplate').content.cloneNode(true);

    if (checkbox.checked) {
        // Hide employment block and insert school fields
        employmentBlock.style.display = 'none';
        employmentBlock.insertAdjacentElement('afterend', schoolFieldsTemplate.firstElementChild);
    } else {
        // Show employment block and remove school fields
        employmentBlock.style.display = 'block';
        const nextElement = employmentBlock.nextElementSibling;
        if (nextElement && nextElement.classList.contains('schoolFields')) {
            nextElement.remove();
        }
    }
}

function currentJob(checkbox) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Months are zero-indexed
    let day = currentDate.getDate();

    // Ensure month and day are two digits
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    const formattedDate = year + '-' + month + '-' + day;

    if (checkbox.checked) {
        const endDateInput = checkbox.closest('.additionalEmploymentBlock').querySelector('.additionalEndDate');
        endDateInput.value = formattedDate;
        endDateInput.type = 'hidden';
        endDateInput.disabled = true; // Optionally disable the end date field if it's a current job
        currentEmployementExists = true;
    } else {
        const endDateInput = checkbox.closest('.additionalEmploymentBlock').querySelector('.additionalEndDate');
        endDateInput.value = ""; // Reset end date value if the checkbox is unchecked
        endDateInput.type = 'text';
        endDateInput.disabled = false; // Enable the end date field if it's not a current job
        currentEmployementExists = false;
    }

    checkEmploymentHistory();
}

function checkDateRange() {
    document.querySelectorAll('.schoolFields').forEach(block => {
        const startDateInput = block.querySelector('.additionalStartDate').value;
        const endDateInput = block.querySelector('.additionalEndDate').value;
        errorMessage = block.querySelector('.errorMessage');
        const startDate = new Date(startDateInput);
        const endDate = new Date(endDateInput);
        const currentDate = new Date();

        if (startDate > currentDate) { // Check if start date is greater than current date
            errorMessage.style.display = "block";
            errorMessage.innerText = "Start date cannot be in the future!";
        } else if (endDate < startDate) { // Check if end date is lesser than start date
            errorMessage.style.display = "block";
            errorMessage.innerText = "End date cannot be before start date!";
        } else {
            errorMessage.style.display = "none";
            errorMessage.innerText = "";
        }
    });
}

// The Employemnent Information Script End here 


// Source of Income section starts here 
let SourceOfIncomeSelect = document.getElementById('SourceOfIncomeSelect');
let salarySection = document.getElementById('salarySection');
let hourlySection = document.getElementById('hourlySection');
let variableSection = document.getElementById('variableSection');
let selfEmployedSection = document.getElementById('selfEmployedSection');
function sourceOfIncome() {
    if (SourceOfIncomeSelect.value === 'Salary') {
        salarySection.style.display = 'block';
        hourlySection.style.display = 'none';
        variableSection.style.display = 'none';
        selfEmployedSection.style.display = 'none';
    } else if (SourceOfIncomeSelect.value === 'Hourly') {
        hourlySection.style.display = 'block';
        salarySection.style.display = 'none';
        variableSection.style.display = 'none';
        selfEmployedSection.style.display = 'none';

    }
    else if (SourceOfIncomeSelect.value === 'Variable income') {
        hourlySection.style.display = 'none';
        salarySection.style.display = 'none';
        selfEmployedSection.style.display = 'none';
        variableSection.style.display = 'block';

    }
    else if (SourceOfIncomeSelect.value === 'Self-employed') {
        hourlySection.style.display = 'none';
        salarySection.style.display = 'none';
        variableSection.style.display = 'none';
        selfEmployedSection.style.display = 'block';
    }

    /**
     * Not much elegant code, regex would solve the multi delimter 
     * problem here..
     * @todo refactor and use regex . . . .
     */
    defaultIncomeType = SourceOfIncomeSelect.value.split(" ").join(" ").split("-").join(" ").split(" ")[0].toLowerCase();
    console.log(defaultIncomeType);
}

// Source of Income section starts here 

// The Salary calculation Starts Here 

let totalSaleryDays = 0;
let Income = 0;
let validateIncome = 0;
var filledMessage = '';
var acceptedDays = [7, 14, 15, 16, 28, 29, 30, 31];
var getMonth = '';
let BoxMaker = true;
let selectedMultiplier = 26;
let selectedFrequency = 'bi-weekly';
var allSalleryFilled = true;
var allHourlyFilled = true;
var newIncome ;
var newmultipier ;
var consoleData = '';
let allMonths = [];
let firstMultiplier = [];
let firstfrequency = [];


function CalcMonthsYTD(convertEndDate) {
    const wholeMonths = convertEndDate.getMonth();

    const dayOfMonth = convertEndDate.getDate();

    const totalDaysInMonth = new Date(convertEndDate.getFullYear(), convertEndDate.getMonth() + 1, 0).getDate();

    const fractionOfMonth = dayOfMonth / totalDaysInMonth;

    const monthsYTD = wholeMonths + fractionOfMonth;

    return monthsYTD;
}


function calculateDays(startDate, endDate) {
    const diffInMilliseconds = endDate - startDate;
    return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;
}

function createAdditionalSalleryBlock() {
    const additionalSalleryBlock = document.createElement('div');
    additionalSalleryBlock.className = 'SalaryBlocks';
    additionalSalleryBlock.innerHTML = `
        <strong class="strongSubHeading" style="margin-botom: 10px;">Salary</strong>
        <label for="">Pay Period Start Date </label>
        <input  onfocus="(this.type='date')"
            onblur="validateSalaryInputs(this,event)" class="SalaryStartDate" />
        <label for="">Pay Period End Date</label>
        <input  onfocus="(this.type='date')"
            onblur="validateSalaryInputs(this,event)" class="SalaryEndDate" />
            <label for="">Current Gross Base Pay</label>
        <input type="number"  class="currentGrossPay"
            onblur="validateSalaryInputs(this,event)" />
        <label for="">YTD Gross Base Pay</label>
        <input type="number"  class="YTDGrossPays"
            onblur="validateSalaryInputs(this,event)" />
        <div class="consoleData" style="display: none;">    
        <label for="">Validated Income</label>
        <input type="hidden" class="newIncome">
        <label for="">Multiplier</label>
        <input type="hidden" class="newmultipier">
            <input type="hidden"  class="storeMonths-salary" />
    </div>
        <p class="filledMessage"></p>
   
    `;
    document.getElementById('salleryBlockContainer').appendChild(additionalSalleryBlock);
}
function calculateTotalSalleryDays() {
    let totalDays = 0;
    const salaryBlocks = document.querySelectorAll('.SalaryBlocks');
    salaryBlocks.forEach(block => {
        const startDateInput = block.querySelector('.SalaryStartDate').value;
        const endDateInput = block.querySelector('.SalaryEndDate').value;
        if (startDateInput && endDateInput) {
            const startDate = new Date(startDateInput);
            const endDate = new Date(endDateInput);

            totalDays += calculateDays(startDate, endDate);
        }
    });

    return totalDays;
}
function areDatesContiguous() {
    const salaryBlocks = document.querySelectorAll('.SalaryBlocks');
    for (let i = 0; i < salaryBlocks.length - 1; i++) {
        const currentEndDate = new Date(salaryBlocks[i].querySelector('.SalaryEndDate').value);
        const nextStartDate = new Date(salaryBlocks[i + 1].querySelector('.SalaryStartDate').value);
        const dayAfterCurrentEndDate = new Date(currentEndDate);
        dayAfterCurrentEndDate.setDate(currentEndDate.getDate() + 1);
        if (dayAfterCurrentEndDate.getTime() !== nextStartDate.getTime()) {
            return false;
        }
    }
    return true;
}
function flagedforvalidation(flag, display, message) {
    BoxMaker = flag;
    filledMessage.style.display = display;
    filledMessage.innerText = message;
}
function validateSalleryAndContinue() {

    totalSaleryDays = calculateTotalSalleryDays();
    var currentGrossPay = [];
    document.querySelectorAll('.currentGrossPay').forEach(input => {
        currentGrossPay.push(input.value);
    });
    const firstValue = currentGrossPay[0];
    const allValuesSame = currentGrossPay.every(item => item === firstValue);
    if (!allValuesSame) {
        flagedforvalidation(false, "block", "Not all values are the same in currentGrossPay");
        return;
    } else {
        flagedforvalidation(true, "none", "");
    }
    var eachPeriodinDays = [];
    const salaryBlocks = document.querySelectorAll('.SalaryBlocks');
    salaryBlocks.forEach(block => {
        const startDateInput = block.querySelector('.SalaryStartDate').value;
        const endDateInput = block.querySelector('.SalaryEndDate').value;
        if (startDateInput && endDateInput) {
            const startDate = new Date(startDateInput);
            const endDate = new Date(endDateInput);
            const Days = calculateDays(startDate, endDate);
            eachPeriodinDays.push(Math.trunc(Days));

        }
    });
    const firstPeriod = eachPeriodinDays[0];
    const checkAcceptedValue = acceptedDays.some(item => item === firstPeriod);
    if (!checkAcceptedValue) {
        flagedforvalidation(false, "block", "Period Should be in these range of days : 7,14,15,16,30,31")
        return;

    } else {
        flagedforvalidation(true, "none", "")
    }
    const AllPeriodsSame = eachPeriodinDays.every(item => item === firstPeriod);
    if (!AllPeriodsSame) {
        if (firstPeriod === 15) {
            if (eachPeriodinDays.some(item => item === 16 || item === 14)) {
                flagedforvalidation(true, "none", "");
            } else {
                flagedforvalidation(false, "block", "pay period Should be same in each period")
                return;
            }

        }
        else if (firstPeriod === 16) {
            if (eachPeriodinDays.some(item => item === 15 || item === 14)) {
                flagedforvalidation(true, "none", "");
            } else {
                flagedforvalidation(false, "block", "pay period Should be same in each period")
                return;
            }
        }

        else {
            flagedforvalidation(false, "block", "pay period Should be same in each period")
            return;
        }

    } else {
        flagedforvalidation(true, "none", "");
    }

    if (!areDatesContiguous()) {
        flagedforvalidation(false, "block", "All pay periods should be in a row without gaps.")
        return;
    }

    if (BoxMaker) {
        if (totalSaleryDays < 28) {
            createAdditionalSalleryBlock();
        }
    }

}

let EndDateOfHourly;
function validateSalaryInputs(Input, event) {
    allSalleryFilled = true;
    document.querySelectorAll('.SalaryBlocks').forEach(block => {
        const startDateInput = block.querySelector('.SalaryStartDate').value;
        const endDateInput = block.querySelector('.SalaryEndDate').value;
        const GrossPay = block.querySelector('.currentGrossPay').value;
        const YTDGross = block.querySelector('.YTDGrossPays').value;
        const storeMonths = block.querySelector('.storeMonths-salary');
        newIncome = block.querySelector('.newIncome');
        newmultipier = block.querySelector('.newmultipier');
        consoleData = block.querySelector('.consoleData');
        const convertToDate = new Date(startDateInput);
        getMonth = convertToDate.getMonth() + 1;
        filledMessage = block.querySelector('.filledMessage');
        const startDate = new Date(startDateInput);
        const endDate = new Date(endDateInput);
        EndDateOfHourly = new Date(endDateInput);

        /** 
         * @note to @jamal
         * without parenthesis??? is this being referenced by some function as args???????
         * Kindly check it please, that if it is not being referenced 
         * add paranthesis or it might cause undefine behaviour . . .
         */
        const currentDate = new Date;

        if (startDate > currentDate) { // Check if start date is greater than current date
            allSalleryFilled = false;
            filledMessage.style.display = "block";
            filledMessage.innerText = "Start date cannot be in the future!";
            return;
        }
        else if (endDate <= startDate) { // Check if end date is lesser than start date
            allSalleryFilled = false;
            filledMessage.style.display = "block";
            filledMessage.innerText = "End date cannot be before start date!";
            return;
        }
        else {
            allSalleryFilled = true;
            filledMessage.style.display = "none";
            filledMessage.innerText = "";
        }

        if (!startDateInput || !endDateInput || !GrossPay || !YTDGross) {
            allSalleryFilled = false;
        }
        else {

            const startDate = new Date(startDateInput);
            const endDate = new Date(endDateInput);
            const days = calculateDays(startDate, endDate);
            let truncDays = Math.trunc(days);
            let multiplier = 0;
            allMonths.push(convertToDate.getMonth());
            const allFeb = allMonths[0] === 1 ? true : false;
            const isFebruary = convertToDate.getMonth() === 1;
            const firstDayOfFebruary = new Date(convertToDate.getFullYear(), 1, 1);
            const isSundayOrMonday = firstDayOfFebruary.getDay() === 0 || firstDayOfFebruary.getDay() === 1;
            const checkCondition = isFebruary && truncDays === 14 && isSundayOrMonday && allFeb;
            switch (truncDays) {
                case 7:
                    multiplier = 52;
                    break;
                case 14:
                    multiplier = selectedMultiplier;
                    break;
                case 15:
                case 16:
                    multiplier = checkCondition ? selectedMultiplier : 24;
                    break;
                default:
                    multiplier = 1;
                    break;
            }
            firstMultiplier.push(multiplier);
            if (checkCondition) {
                if (document.querySelector('.pIntenvalBox').style.display !== 'block') {
                    document.querySelector('.pIntenvalBox').style.display = 'block';
                    allSalleryFilled = false;
                    return;
                }
            } else {
                document.querySelector('.pIntenvalBox').style.display = 'none';
            }
            if (truncDays >= 28 && truncDays <= 31) {
                validateIncome = GrossPay ? (GrossPay) : 0;
            } else {
                validateIncome = GrossPay ? (GrossPay * firstMultiplier[0]) / 12 : 0;
            }
            let monthsYTD = CalcMonthsYTD(EndDateOfHourly);
    
            if((monthsYTD * validateIncome) !== parseInt(YTDGross)){
                allSalleryFilled = false;
                filledMessage.style.display = "block";
                filledMessage.innerText = `Months(${monthsYTD}) * Income(${validateIncome}) Is not equal to Gross Pay(${parseInt(YTDGross)})`;
                return;
            }else{
                allSalleryFilled = true;
                filledMessage.style.display = "none";
                filledMessage.innerText = "";
            }

            consoleData.style.display = "block";
            storeMonths.value = monthsYTD;
            newIncome.value = validateIncome;
            newIncome.type = 'text';
            newIncome.disabled = true;
            newmultipier.value = firstMultiplier[0];
            newmultipier.type = 'text';
            newmultipier.disabled = true;


        }
    });


    if (allSalleryFilled) {
        validateSalleryAndContinue();
    }

}
function updateMultiplier(selectElement) {
    const selectedValue = selectElement.value;
    firstMultiplier = [];
    if (selectedValue === "Bi-Weekly") {
        selectedMultiplier = 26;
        firstMultiplier.push(selectedMultiplier);
    } else if (selectedValue === "2x Per Month") {
        selectedMultiplier = 24;
        firstMultiplier.push(selectedMultiplier);
    }
    validateSalaryInputs();
}

// The Salary calculation Starts Here 

// The Hourly calculation Starts Here 
let hourlyConsole = '';
let checkHourlyRateField = '';
let paychecksYTDField = '';
let expectedYTDHourField = '';
let incomeField = '';
var yearStart = '';
let renderResultsCalled = false;
var reasonBox = document.querySelector('.reasonBox');

function createAdditionalHourlyBlock() {
    const additionalHourlyBlock = document.createElement('div');
    additionalHourlyBlock.className = 'hourlyBlocks';
    additionalHourlyBlock.innerHTML = `
    <strong class="strongSubHeading" style="margin-bottom: 10px;">Hourly</strong>
    <label for="">Pay Period Start Date </label>
    <input  onfocus="(this.type='date')" onblur="validateHourlyInputs(this,event)" class="hourlyStartDate" />
    <label for="">Pay Period End Date</label>
    <input  onfocus="(this.type='date')" onblur="validateHourlyInputs(this,event)" class="hourlyEndDate" />
    <label for="">Hourly Rate</label>
    <input type="number"  class="hourlyRate" onblur="validateHourlyInputs(this,event)" />
    <label for="">Current Hours Base Pay (include Holiday, Sick, PTO)</label>
    <input type="number"  class="currentHourBasePay" onblur="validateHourlyInputs(this,event)" />
    <label for="">Current Gross Base Pay (include Holiday, Sick, PTO)</label>
    <input type="number"  class="currentGrossBasePay-hourly" onblur="validateHourlyInputs(this,event)" />
    <label for="">YTD Hours (include Holiday, Sick, PTO)</label>
    <input type="number"  class="YTDhour-hourly" onblur="validateHourlyInputs(this,event)" />
    <label for="">YTD Gross Base Pay (include Holiday, Sick, PTO)</label>
    <input type="number"  class="ytdGrossBasePay-hourly" onblur="validateHourlyInputs(this,event)" />
    <div class="hourlyConsole" style="display: none;">
                <label for="">checkHourlyRate</label>
                <input type="number" placeholder="1380" class="checkHourlyRate-Field"
                    onblur="validateHourlyInputs(this,event)" />
                <label for="">paychecksYTD</label>
                <input type="number" placeholder="1380" class="paychecksYTD-Field"
                    onblur="validateHourlyInputs(this,event)" />
                <label for="">expectedYTDHour</label>
                <input type="number" placeholder="1380" class="expectedYTDHour-Field"
                    onblur="validateHourlyInputs(this,event)" />
                <label for="">Income</label>
                <input type="number" placeholder="1380" class="income-Field"
                    onblur="validateHourlyInputs(this,event)" />
                    <input type="hidden"  class="storeMonths-hourly" />
                    
            </div>
    <p class="filledMessage"></p>
`;
    document.getElementById('hourlyBlockContainer').appendChild(additionalHourlyBlock);
}
function calculateTotalHourlyDays() {
    let totalDays = 0;
    const hourlyBlocks = document.querySelectorAll('.hourlyBlocks');
    hourlyBlocks.forEach(block => {
        const startDateInput = block.querySelector('.hourlyStartDate').value;
        const endDateInput = block.querySelector('.hourlyEndDate').value;

        if (startDateInput && endDateInput) {
            const startDate = new Date(startDateInput);
            const endDate = new Date(endDateInput);
            totalDays += calculateDays(startDate, endDate);
        }
    });
    return totalDays;
}
function areHourlyDatesContiguous() {
    const hourlyBlocks = document.querySelectorAll('.hourlyBlocks');
    for (let i = 0; i < hourlyBlocks.length - 1; i++) {
        const currentEndDate = new Date(hourlyBlocks[i].querySelector('.hourlyEndDate').value);
        const nextStartDate = new Date(hourlyBlocks[i + 1].querySelector('.hourlyStartDate').value);
        const dayAfterCurrentEndDate = new Date(currentEndDate);
        dayAfterCurrentEndDate.setDate(currentEndDate.getDate() + 1);
        if (dayAfterCurrentEndDate.getTime() !== nextStartDate.getTime()) {
            return false;
        }
    }
    return true;
}
function validateHourlyInputs(input, event) {
    allHourlyFilled = true;
    let startDate = '';
    let endDate = '';
    let days = '';
    let hourlyRate;
    let HourlyDaysIn;

    const hourlyBlockContainer = document.getElementById('hourlyBlockContainer');
    const variablesToCheck = ['.hourlyStartDate', '.hourlyEndDate', '.hourlyRate', '.currentHourBasePay', '.currentGrossBasePay-hourly', '.YTDhour-hourly', '.ytdGrossBasePay-hourly'];
    let allFieldsFilled = true; // Flag to track if all fields are filled
    for (const selector of variablesToCheck) {
        const elements = hourlyBlockContainer.querySelectorAll(selector);
        for (const element of elements) {
            const value = element.value;
            if (!value) {
                allFieldsFilled = false; // Set the flag to false if any field is empty
                break; // No need to check further if one field is empty
            }
        }
        if (!allFieldsFilled) {
            break; // No need to check further if one field is empty
        }
    }

    if (allFieldsFilled) {
        // If all fields are filled, calculate HourlyDaysIn
        HourlyDaysIn = calculateTotalHourlyDays();
    }

    document.querySelectorAll('.hourlyBlocks').forEach(block => {
        const hourlyStartDate = block.querySelector('.hourlyStartDate').value;
        const hourlyEndDate = block.querySelector('.hourlyEndDate').value;
        hourlyRate = block.querySelector('.hourlyRate').value;
        const convertToDate = new Date(hourlyEndDate);
        const currentHourBasePay = block.querySelector('.currentHourBasePay').value;
        const currentGrossBasePayHourly = block.querySelector('.currentGrossBasePay-hourly').value;
        const ytdHourHourly = block.querySelector('.YTDhour-hourly').value;
        const ytdGrossBasePayHourly = block.querySelector('.ytdGrossBasePay-hourly').value;
        const storeMonths = block.querySelector('.storeMonths-hourly');
        checkHourlyRateField = block.querySelector('.checkHourlyRate-Field');
        paychecksYTDField = block.querySelector('.paychecksYTD-Field');
        expectedYTDHourField = block.querySelector('.expectedYTDHour-Field');
        incomeField = block.querySelector('.income-Field');
        filledMessage = block.querySelector('.filledMessage');
        hourlyConsole = block.querySelector('.hourlyConsole');


        if (!hourlyStartDate || !hourlyEndDate || !hourlyRate || !currentHourBasePay || !currentGrossBasePayHourly || !ytdHourHourly || !ytdGrossBasePayHourly) {
            allHourlyFilled = false;
            return;
        }
        if (hourlyStartDate && hourlyEndDate) {
            startDate = new Date(hourlyStartDate);
            endDate = new Date(hourlyEndDate);
            days = calculateDays(startDate, endDate);
            const validDays = acceptedDays.includes(days);
        }
        if (HourlyDaysIn >= 28) {
            const checkHourlyRate = ytdGrossBasePayHourly / ytdHourHourly;
            if (checkHourlyRate != hourlyRate) {
                filledMessage.innerText = "there was a pay raise...";
                filledMessage.style.display = "block";
                allHourlyFilled = false;
            }
            allMonths.push(convertToDate.getMonth());
            firstfrequency = [];
            const allFeb = allMonths[0] === 1 ? true : false;
            const isFebruary = convertToDate.getMonth() === 1;
            const firstDayOfFebruary = new Date(convertToDate.getFullYear(), 1, 1);
            let truncDays = days;
            const isSundayOrMonday = firstDayOfFebruary.getDay() === 0 || firstDayOfFebruary.getDay() === 1;
            const checkCondition = isFebruary && truncDays === 14 && isSundayOrMonday && allFeb;
            let frequency = '';
            switch (truncDays) {
                case 7:
                    frequency = 'weekly';
                    break;
                case 14:
                    frequency = selectedFrequency;
                    break;
                case 15:
                case 16:
                    frequency = checkCondition ? selectedFrequency : 'semi-monthly';
                    break;
                default:
                    frequency = 'monthly';
                    break;
            }
            firstfrequency.push(frequency);
            const frequencyOne = firstfrequency[0];
            let frequencyValue = '';
            switch (frequencyOne) {
                case 'weekly':
                    frequencyValue = 40;
                    break;
                case 'bi-weekly':
                    frequencyValue = 80;
                    break;
                case 'semi-monthly':
                    frequencyValue = 86.66666666677;
                    break;
                case 'monthly':
                    frequencyValue = 173.333333;
                    break;
                default:
                    frequencyValue = 1;
                    break;
            }
            if (checkCondition) {
                if (document.querySelector('.pIntenvalBox2').style.display !== 'block') {
                    document.querySelector('.pIntenvalBox2').style.display = 'block';
                    return;
                }
            } else {
                document.querySelector('.pIntenvalBox2').style.display = 'none';

            }

            const paychecksYTD = calculatePaychecksYTD(frequencyOne, startDate, endDate);
            const expectedYTDHour = frequencyValue * paychecksYTD;
            if (expectedYTDHour !== ytdHourHourly) {
                filledMessage.innerText = "Borrower has less than 40 hours per week";
                filledMessage.style.display = "block";
                reasonBox.style.display = "block";
                allHourlyFilled = false;
                // Check if current employment exists
                if (currentEmployementExists && !renderResultsCalled) {
                    // Example usage - Replace with your actual data
                    const employmentHistory = currentEmploymentDates;

                    // Calculate the weeks for employment history and separate by year
                    const weeksByYearEmploymentHistory = separateWeeksByYear(employmentHistory);
                    renderResults(weeksByYearEmploymentHistory);
                    renderResultsCalled = true;
                }

            } else {
                filledMessage.innerText = "";
                filledMessage.style.display = "none";
                reasonBox.style.display = "none";
                allHourlyFilled = true;
            }
            const monthsYTD = CalcMonthsYTD(convertToDate); // no of months
            storeMonths.value = monthsYTD;
            const income = hourlyRate * 2080 / 12;
            checkHourlyRateField.value = checkHourlyRate;
            checkHourlyRateField.disabled = true;
            paychecksYTDField.value = paychecksYTD;
            paychecksYTDField.disabled = true;
            expectedYTDHourField.value = expectedYTDHour;
            expectedYTDHourField.disabled = true
            incomeField.value = income;
            incomeField.disabled = true;
            hourlyConsole.style.display = 'block';
        }
    });
    if (allHourlyFilled) {

        validateHourlyAndContinue()
    }
}

// Function to calculate the number of weeks between two dates
function calculateWeeks(startDate, endDate) {
    // Get the time difference in milliseconds
    const differenceInMilliseconds = endDate - startDate;

    // Convert milliseconds to days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const days = differenceInMilliseconds / millisecondsPerDay;

    // Convert days to weeks
    const weeks = days / 7;

    // Return the exact number of weeks without rounding
    return weeks;
}

function updateWeeks(event, blockClass) {
    const className = blockClass;
    // Get the closest ancestor element with the class .yearblock
    const block = event.target.closest(className);
    if (block) {
        // Get start and end date input values
        const startDateInput = block.querySelector('.startDateInHourly').value;
        const endDateInput = block.querySelector('.endDateInHourly').value;
        const [startYear, startMonth, startDay] = startDateInput.split('-').map(Number);
        const [endYear, endMonth, endDay] = endDateInput.split('-').map(Number);

        // Create new Date objects using split values
        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);
        // Calculate the number of weeks between the dates
        const noOfWeeks = calculateWeeks(startDate, endDate);
        // Set the result to the .numberOfWeeksClass input
        block.querySelector('.numberOfWeeksClass').value = noOfWeeks;
        block.querySelector('.ExpectedYTDHoursYear').value = noOfWeeks * 40;

        // Call calculateAverageHour at the end
        calculateAverageHour(event);
    }
}
// Function to separate weeks by year for employment history, including from and to dates

function separateWeeksByYear(employmentHistory) {
    let weeksByYear = {};
    employmentHistory.forEach(employmentPeriod => {
        const startDate = new Date(employmentPeriod.startDate);
        const endDate = new Date(employmentPeriod.endDate);
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
        for (let year = startYear; year <= endYear; year++) {
            const startOfCurrentYear = new Date(year, 0, 1);
            const endOfCurrentYear = new Date(year, 11, 31);
            const adjustedStartDate = startYear === year ? startDate : startOfCurrentYear;
            const adjustedEndDate = endYear === year ? endDate : endOfCurrentYear;
            const weeksInCurrentYear = calculateWeeks(adjustedStartDate, adjustedEndDate);
            const monthsInCurrentYear = calculateMonths(adjustedStartDate, adjustedEndDate);
            if (!weeksByYear[year]) {
                weeksByYear[year] = {
                    year: year,
                    weeks: weeksInCurrentYear,
                    months: monthsInCurrentYear,
                    from: adjustedStartDate,
                    to: adjustedEndDate,
                    hours: weeksInCurrentYear * 40
                };
            } else {
                weeksByYear[year].weeks += weeksInCurrentYear;
                weeksByYear[year].hours += weeksInCurrentYear * 40;
                weeksByYear[year].to = adjustedEndDate;
                weeksByYear[year].months += monthsInCurrentYear;
            }
        }
    });
    const currentYear = new Date().getFullYear();
    const filteredWeeksByYear = {};
    for (let year = currentYear; year >= currentYear - 2; year--) {
        if (weeksByYear[year]) {
            filteredWeeksByYear[year] = weeksByYear[year];
        }
    }

    return filteredWeeksByYear;
}

function validateHourlyAndContinue() {
    totalHourlyDays = calculateTotalHourlyDays();
    var hourlyRates = [];
    document.querySelectorAll('.hourlyRate').forEach(input => {
        hourlyRates.push(input.value);
    });
    const firstValue = hourlyRates[0];
    const allValuesSame = hourlyRates.every(item => item === firstValue);
    if (!allValuesSame) {
        flagedforvalidation(false, "block", "Not all values are the same in hourlyRates");
        return;
    } else {
        flagedforvalidation(true, "none", "");
    }
    var eachPeriodinDays = [];
    const hourlyBlocks = document.querySelectorAll('.hourlyBlocks');
    hourlyBlocks.forEach(block => {
        const startDateInput = block.querySelector('.hourlyStartDate').value;
        const endDateInput = block.querySelector('.hourlyEndDate').value;
        if (startDateInput && endDateInput) {
            const startDate = new Date(startDateInput);
            const endDate = new Date(endDateInput);
            const days = calculateDays(startDate, endDate);
            eachPeriodinDays.push(days);
        }
    });
    const firstPeriod = eachPeriodinDays[0];
    const allPeriodsSame = eachPeriodinDays.every(item => item === firstPeriod);
    if (!allPeriodsSame) {
        if (firstPeriod === 15) {
            if (eachPeriodinDays.some(item => item === 16 || item === 14)) {
                flagedforvalidation(true, "none", "");
            } else {
                flagedforvalidation(false, "block", "pay period Should be same in each period")
                return;
            }

        }
        else if (firstPeriod === 16) {
            if (eachPeriodinDays.some(item => item === 15 || item === 14)) {
                flagedforvalidation(true, "none", "");
            } else {
                flagedforvalidation(false, "block", "pay period Should be same in each period")
                return;
            }
        }
        else {
            flagedforvalidation(false, "block", "pay period Should be same in each period")
            return;
        }

    } else {
        flagedforvalidation(true, "none", "");
    }

    var ytdGrossBasePay = [];
    document.querySelectorAll('.ytdGrossBasePay-hourly').forEach(input => {
        ytdGrossBasePay.push(input.value);
    });
    const totalContiguousDays = areHourlyDatesContiguous();
    if (!totalContiguousDays) {
        flagedforvalidation(false, "block", "Dates are not contiguous");
        return;
    } else {
        flagedforvalidation(true, "none", "");
    }
    if (BoxMaker) {
        if (totalHourlyDays < 28) {
            createAdditionalHourlyBlock();
        }
    }
}

function calculatePaychecksYTD(payFrequency, lastPaystubStartDate, lastPaystubEndDate) {
    const startDate = new Date(lastPaystubStartDate);
    const endDate = new Date(lastPaystubEndDate);
    const yearStart = new Date(endDate.getFullYear(), 0, 1);
    let totalPaychecks = 0;

    switch (payFrequency) {
        case 'weekly':
            totalPaychecks = Math.floor((endDate - yearStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
            break;
        case 'bi-weekly':
            const daysSinceYearStart = Math.ceil((endDate - yearStart) / (24 * 60 * 60 * 1000));
            totalPaychecks = Math.floor(daysSinceYearStart / 14); // No need to add 1 for the current incomplete pay period
            break;

        case 'semi-monthly':
            const startYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();
            const endMonth = endDate.getMonth();
            for (let month = 0; month < endMonth; month++) {
                totalPaychecks += 2; // Each complete month contributes 2 paychecks
            }

            // Handle the current month
            if (endDate.getDate() > 15) {
                totalPaychecks += 2; // Both semi-monthly paychecks for the current month
            } else if (endDate.getDate() >= 1) {
                totalPaychecks += 1; // Only the first semi-monthly paycheck for the current month
            }
            break;
        case 'monthly':
            totalPaychecks = endDate.getMonth() + 1;
            break;
        default:
            throw new Error('Invalid pay frequency');
    }

    return totalPaychecks;
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function renderResults(weeksByYear) {

    const yearCollectionDiv = document.querySelector('.yearCollection');
    const currentYear = new Date().getFullYear();
    const sortedYears = Object.keys(weeksByYear).sort((a, b) => b - a);

    sortedYears.forEach(year => {
        const yearData = weeksByYear[year];
        const hoursValue = yearData.hours;
        const weeks = yearData.weeks;

        const yearLabel = year == currentYear ? "YTD" : year;

        const yearHTML = `
    <strong class="strongSubHeading" style="margin-bottom: 10px;">${yearLabel}</strong>
    <label for="">From</label>
    <input type = "date" class="startDateInHourly" value="${formatDate(new Date(yearData.from))}" disabled />
    <label for="">To</label>
    <input type = "date" class="endDateInHourly" value="${formatDate(new Date(yearData.to))}" ${year == currentYear ? 'onblur="updateWeeks(event,\'.yearblock\')"' : 'disabled'} />
    <label for="">YTD Gross Base Pay</label>
    <input type="number" onblur='calculateAverageHour(event)' class="YTDGrossBasePay-HY" />
    <label for="">YTD Hours</label>
    <input type="number" onblur='calculateAverageHour(event)' class="ytdHoursInputYear" />
    <label for="">Expected YTD Hours</label>
    <input type="number" class = "ExpectedYTDHoursYear" value="${hoursValue}" disabled />
    <label for="">Number of weeks</label>
    <input type="number" class="numberOfWeeksClass" value="${weeks}" disabled />
    <label for="">Average Hour</label>
    <input type="number" value="" class="AveragehourYear" disabled />
    <label for="">YTD income</label>
    <input type="number" value="" class="incomeyear" disabled />
`;

        const yearDiv = document.createElement('div');
        yearDiv.className = 'yearblock';
        yearDiv.innerHTML = yearHTML;
        yearCollectionDiv.appendChild(yearDiv);
    });
}


function calculateAverageHour(event) {
    // Get the closest ancestor element with the class .hourlyBlocks
    const block = event.target.closest('.yearblock');

    // Find the input elements within the block
    const YTDGrossBasePayHY = block.querySelector('.YTDGrossBasePay-HY');
    const ytdHoursInput = block.querySelector('.ytdHoursInputYear');
    const AveragehourYear = block.querySelector('.AveragehourYear');
    const incomeyear = block.querySelector('.incomeyear');
    const numberOfWeeksClass = block.querySelector('.numberOfWeeksClass').value;

    // Get the values from the input fields
    const YTDGrossBasePay = YTDGrossBasePayHY.value;
    const ytdHours = ytdHoursInput.value;

    // Check if both fields are filled
    if (YTDGrossBasePay.length > 1 && ytdHours.length > 1) {
        // Calculate the closest average hour
        const averageHour = ytdHours / numberOfWeeksClass;
        const income = YTDGrossBasePay / (numberOfWeeksClass / 4.33333333);
        AveragehourYear.value = averageHour;
        incomeyear.value = income;
    }
}

function updateFrequency(selectElement) {
    const selectedValue = selectElement.value;
    firstfrequency = [];
    if (selectedValue === "Bi-Weekly") {
        selectedFrequency = 'bi-weekly';
        firstfrequency.push(selectedFrequency);
    } else if (selectedValue === "2x Per Month") {
        selectedFrequency = 'semi-monthly';
        firstfrequency.push(selectedFrequency);
    }
    validateHourlyInputs();
}

// varable Section Starts Here 

let wrpperBasePay = document.querySelector('.wrpper-basePay');
let basePaySalary = document.getElementById("basePaySalary");
let varPay = document.getElementById("varPay");
let basePayQuestionSelect = document.getElementById("basePayQuestionSelect");
let currentRateOfPay = document.querySelector('.currentRateOfPay');
let payFrequencyInVar = document.querySelector('.payFrequencyInVar');
let monthlyEarning = document.querySelector('.monthlyEarning');
let yearlyEarning = document.querySelector('.yearlyEarning');
let clacResults = document.querySelector('.clacResults');
let formulaOfMonthlyEarning; 

function calcBasePay() {
    if (currentRateOfPay.value && payFrequencyInVar.value) {
        let periodsPerYear;
        const payFrequency = payFrequencyInVar.value;
        switch (payFrequency) {
            case "Weekly":
                periodsPerYear = 52;
                break;
            case "Bi-Weekly":
                periodsPerYear = 26;
                break;
            case "Bi-monthly":
                periodsPerYear = 24;
                break;
            case "Monthly":
                periodsPerYear = 12;
                break;
            case "Yearly":
                periodsPerYear = 1;
                break;
            case "Hourly":
                periodsPerYear = 2080;
                break;
            default:
                periodsPerYear = 1;
        }

        const yearMoney = periodsPerYear * currentRateOfPay.value;
        const monthMoney = yearMoney / 12;
        formulaOfMonthlyEarning = ` ${periodsPerYear} * ${currentRateOfPay.value} / 12`;
        yearlyEarning.value = yearMoney;
        monthlyEarning.value = monthMoney;
        clacResults.style.display = "block";

    }
}

function basePayQuestion() {
    if (basePayQuestionSelect.value === "Yes") {
        basePaySalary.style.display = "block";
        // Example usage - Replace with your actual data
        const employmentHistory = currentEmploymentDates;
        // Calculate the weeks for employment history and separate by year
        const weeksByYearEmploymentHistory = separateWeeksByYear(employmentHistory);
        renderYTDandTwoYear(weeksByYearEmploymentHistory);
        wrpperBasePay.style.display = "none";

    } else {
        basePaySalary.style.display = "none";
        wrpperBasePay.style.display = "block";

    }

}

function salleryToBasePay() {
    wrpperBasePay.style.display = "block";
}
function renderYTDandTwoYear(weeksByYear) {

    const yearCollectionDiv = document.querySelector('.Ytdand2year');
    const currentYear = new Date().getFullYear();
    const sortedYears = Object.keys(weeksByYear).sort((a, b) => b - a);

    sortedYears.forEach(year => {
        const yearData = weeksByYear[year];
        const hoursValue = yearData.hours;
        const months = yearData.months;

        const yearLabel = year == currentYear ? "YTD" : year;

        const yearHTML = `
<strong class="strongSubHeading" style="margin-bottom: 10px;">${yearLabel}</strong>
<label for="">From</label>
<input type = "date" class="startDateInVar" value="${formatDate(new Date(yearData.from))}" disabled />
<label for="">To</label>
<input type = "date" class = "endDateInVar" value="${formatDate(new Date(yearData.to))}" ${year == currentYear ? 'onblur="updateMonths(event,\'.yearEarningBlock\')"' : 'disabled'} />
<label for=""  >Total Earnings</label>
<input type="number" onblur='calculateTotalEarning(event,".yearEarningBlock")'  class="totalEarningsInVar" />
<label for="">No Of Months</label>
<input type="number" class="noOfMonths" value="${months}"" disabled />
<label for="" >Monthly Earnings</label>
<input type="number" class = "MonEarning"  disabled />
<label for="">% Change</label>
<input type="number" class="changeInEarning"  disabled />

`;

        const yearDiv = document.createElement('div');
        yearDiv.className = 'yearEarningBlock';
        yearDiv.innerHTML = yearHTML;
        yearCollectionDiv.appendChild(yearDiv);
    });
}


/**
 * Why do we have two functions when their 
 * functionality, their purpose is same?
 */
function calculateMonths(startDate, endDate) {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    // Calculate the difference in years and months
    const diffYears = endYear - startYear;
    const diffMonths = endMonth - startMonth;

    // Calculate the number of days in the starting month and ending month
    const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
    const daysInEndMonth = new Date(endYear, endMonth + 1, 0).getDate();

    // Calculate the fraction of the ending month
    const fractionalMonthsEnd = endDay / daysInEndMonth;

    // Calculate the total number of months
    let totalMonths = (diffYears * 12) + diffMonths;

    // If there's a fraction of the ending month and the starting day is less than or equal to the days in the starting month, add it to the total
    if (startDay <= daysInStartMonth) {
        totalMonths += fractionalMonthsEnd;
    } else {
        // If the starting day is greater than the number of days in the starting month,
        // we're considering an entire additional month
        totalMonths++;
    }

    return totalMonths; // Return as a string with six decimal places
}

function updateMonths(event, blockClass) {
    const className = blockClass;
    // Get the closest ancestor element with the class .yearEarningBlock
    const block = event.target.closest(className);
    if (block) {
        // Get start and end date input values
        const startDateInput = block.querySelector('.startDateInVar').value;
        const endDateInput = block.querySelector('.endDateInVar').value;

        // Split the input values to ensure correct parsing
        const [startYear, startMonth, startDay] = startDateInput.split('-').map(Number);
        const [endYear, endMonth, endDay] = endDateInput.split('-').map(Number);

        // Create new Date objects using split values
        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);
        // Calculate the number of months between the dates
        const noOfMonths = calculateMonths(startDate, endDate);

        // Set the result to the .noOfMonths input
        block.querySelector('.noOfMonths').value = noOfMonths;
        calculateTotalEarning(event, className);
    }
}
function paidOutQuestion(selectElement) {
    let oftenPaid = selectElement.value;
    let block = selectElement.closest('.bonusCommissionQuestions');
    let yearlyConnected = block.querySelector('.yearlyConnected');
    let quarterlyConnected = block.querySelector('.quarterlyConnected');

    if (oftenPaid === "Once a year") {
        yearlyConnected.style.display = "block";
        quarterlyConnected.style.display = "none";
    } else if (oftenPaid === "Quarterly") {
        yearlyConnected.style.display = "none";
        quarterlyConnected.style.display = "block";
    }
}

function renderBasePay(weeksByYear, payType) {
    const renderBasePayBox = document.querySelector('.renderBasePay');
    const currentYear = new Date().getFullYear();
    const sortedYears = Object.keys(weeksByYear).sort((a, b) => b - a);
    const uniqueClass = `BasePayEarningBlock-${payType.replace(/\s+/g, '-')}`;

    // Check if the block already exists
    if (document.querySelector(`.${uniqueClass}`)) {
        return; // Block already exists, exit the function
    }

    // HTML for bonus and commission questions
    let bonusQuestionHTML = '';
    if (payType === 'Bonus' || payType === 'Commission') {
        const additionalMonthlyOption = payType === 'Commission' ? '<option value="Monthly">Monthly</option>' : '';
        bonusQuestionHTML = `  
    <strong class="strong-text">Additional Information About ${payType}</strong>  
    <div class="bonusCommissionQuestions">
        <p class="bonus-q">How often is ${payType.toLowerCase()} paid out?</p>
        <select class="howOften"  onchange = paidOutQuestion(this)> 
            <option value="Once a year">How often</option>
            <option value="Once a year">Once a year</option>
            <option value="Quarterly">Quarterly</option>
            ${additionalMonthlyOption}
        </select> 
        <div class="yearlyConnected" style="display:none">
            <p class="bonus-q">Has ${payType.toLowerCase()} been paid out this year?</p>
            <select class = "yearlyConnectedSelect"> 
                <option value="PaidOutAlready">Select Option</option>
                <option value="PaidOutAlready">${payType} has been paid out already</option>
                <option value="NotPaidOutYetFinalized">${payType} has not been paid out yet but amount has already been finalized</option>
                <option value="NotPaidOutNotFinalized">${payType} has not been paid out and has not been finalized</option>
            </select> 
        </div>
        <div class="quarterlyConnected" style="display:none">
            <p class="bonus-q">How many ${payType.toLowerCase()} payouts have been made?</p>
            <select class = "quarterlyConnectedSelect"> 
                 <option value="one">How many</option>
                <option value="one">1</option>
                <option value="two">2</option>
                <option value="three">3</option>
                <option value="four">4</option>
            </select> 
        </div>
    </div>
    
`;

    }

    // Loop through years
    sortedYears.forEach((year, index) => {
        const yearData = weeksByYear[year];
        const hoursValue = yearData.hours;
        const months = yearData.months;

        const yearLabel = year == currentYear ? "YTD" : year;

        const yearHTML = `
<h3>${payType}</h3>
<strong class="strongSubHeading" style="margin-bottom: 10px;">${yearLabel}</strong>
<label for="">From</label>
<input type="date" class="startDateInVar" value="${formatDate(new Date(yearData.from))}" disabled />
<label for="">To</label>
<input type="date" class="endDateInVar" value="${formatDate(new Date(yearData.to))}" ${year == currentYear ? `onblur="updateMonths(event, '.${uniqueClass}')"` : 'disabled'} />
<label for="">Total Earnings</label>
<input type="number" onblur="calculateTotalEarning(event, '.${uniqueClass}')" class="totalEarningsInVar" />
<label for="">No Of Months</label>
<input type="number" class="noOfMonths" value="${months}" disabled />
<label for="">Monthly Earnings</label>
<input type="number" class="MonEarning" disabled />
<label for="">% Change</label>
<input type="number" class="changeInEarning" disabled />
`;



        const yearDiv = document.createElement('div');
        yearDiv.className = uniqueClass;

        // Append bonus/commission questions inside the block if it's the first year block
        if (bonusQuestionHTML && index === 0) {
            const bonusDiv = document.createElement('div');
            bonusDiv.innerHTML = bonusQuestionHTML;
            yearDiv.appendChild(bonusDiv);
        }

        yearDiv.innerHTML += yearHTML;
        renderBasePayBox.appendChild(yearDiv);
    });
}

document.querySelectorAll('input[name="compensation"]').forEach(checkbox => {
    checkbox.addEventListener('change', createBoxesBasedOnPay);
});

function createBoxesBasedOnPay() {
    const selectedValues = Array.from(document.querySelectorAll('input[name="compensation"]:checked'))
        .map(checkbox => checkbox.value);

    const existingBlocks = Array.from(document.querySelectorAll('.renderBasePay > div'));

    // Remove blocks corresponding to unchecked checkboxes
    existingBlocks.forEach(block => {
        const blockType = block.querySelector('h3').textContent.trim();
        if (!selectedValues.includes(blockType)) {
            block.remove();
        }
    });

    // Add new blocks for selected checkboxes
    selectedValues.forEach(select => {
        const employmentHistory = currentEmploymentDates;  // Use your actual data source here
        const weeksByYearEmploymentHistory = separateWeeksByYear(employmentHistory);
        renderBasePay(weeksByYearEmploymentHistory, select);
    });
}

function calculateTotalEarning(event, blockClass) {
    const className = blockClass;
    // Get all elements with the class .yearEarningBlock
    const blocks = document.querySelectorAll(className);

    let changes = [];
    let earning = [];
    let monthlyEarning = [];
    let months = [];

    blocks.forEach((block, index) => {
        // Find the input elements within the block
        const totalEarnings = block.querySelector('.totalEarningsInVar').value;
        const noOfMonths = block.querySelector('.noOfMonths').value;
        const monEarningElement = block.querySelector('.MonEarning');
        const changeInEarningElement = block.querySelector('.changeInEarning');
        // Check if block is for bonus or commission
        const payType = block.querySelector('h3')?.textContent.trim() || '';

        if (totalEarnings && noOfMonths > 0) {
            let monEarning;
            // Calculate the monthly earning
            if (payType === 'Bonus' || payType === 'Commission') {
                let howOften = blocks[0].querySelector('.howOften').value;
                let divider = 12;
                if (howOften === "Once a year") {
                    let yearlyConnectedSelect = blocks[0].querySelector('.yearlyConnectedSelect').value;
                    monEarning = totalEarnings / divider;
                    monEarningElement.value = monEarning;
                }
                else if (howOften === "Quarterly") {
                    let quarterlyConnectedSelect = blocks[0].querySelector('.quarterlyConnectedSelect').value;

                    switch (quarterlyConnectedSelect) {
                        case "one":
                            divider = 3;
                            break;
                        case "two":
                            divider = 6;
                            break;
                        case "three":
                            divider = 9;
                            break;
                        case "four":
                            divider = 12;
                            break;
                        default:
                            divider = 3;
                            break;
                    }

                    monEarning = totalEarnings / divider;
                    monEarningElement.value = monEarning;

                }
                else if (howOften === "Monthly") {
                    monEarning = totalEarnings / noOfMonths;
                    monEarningElement.value = monEarning;
                }

            }
            else {
                monEarning = totalEarnings / noOfMonths;
                monEarningElement.value = monEarning;
            }
            earning.push(totalEarnings);
            months.push(noOfMonths);
            monthlyEarning.push(monEarning);
            // Calculate the change in earning if the next month's earning exists
            if (index + 1 < blocks.length) {
                const nextBlock = blocks[index + 1];
                const nextTotalEarnings = nextBlock.querySelector('.totalEarningsInVar').value;
                const nextNoOfMonths = nextBlock.querySelector('.noOfMonths').value;

                if (nextTotalEarnings && nextNoOfMonths > 0) {
                    const nextMonEarning = nextTotalEarnings / nextNoOfMonths;
                    const changeInEarning = ((monEarning / nextMonEarning) - 1) * 100;
                    changeInEarningElement.value = changeInEarning;
                    changes.push(changeInEarning);
                }
            }
        }


    });
    checkChangeStatus(changes, blockClass, earning, months, monthlyEarning);
}

function checkChangeStatus(changes, blockClass, earning, months, monthlyEarning) {
    if (changes.length < 2) {
        return; // Not enough data to evaluate
    }
    let qualifyingPay;
    let status;
    const className = blockClass;
    const blocks = document.querySelectorAll(className);

    if (className === '.yearEarningBlock') {
        qualifyingPay = document.querySelector('.monthlyEarning').value;
    } else {
        const changeFrom2023ToYTD = changes[0];
        const changeFrom2022To2023 = changes[1];
        const monthsInt = months.map(month => parseInt(month));
        const earnInt = earning.map(item => parseInt(item));
        const lowestEarning = Math.min(...monthlyEarning);

        // Determine the status and calculate the qualifying pay
        if (changeFrom2022To2023 < -10 && changeFrom2023ToYTD > 0) {
            status = 'Normalized';
            qualifyingPay = lowestEarning;
        } else if (changeFrom2023ToYTD < -10) {
            status = 'Unstable';
            qualifyingPay = lowestEarning;
        } else if (changeFrom2023ToYTD >= -10) {
            status = 'Stable';
            const totalEarnings = earnInt.reduce((a, b) => a + b, 0);
            const totalMonths = monthsInt.reduce((a, b) => a + b, 0);
            qualifyingPay = totalEarnings / totalMonths;
        } else {
            status = 'Undefined';
            qualifyingPay = 1;
        }

        employmentSummary.incomeType.variable.status = status.toLowerCase();
    }

    // Create the HTML for the qualifying variable pay input
    const html = `
<label for="qualifyingPay">Qualifying Variable Pay</label>
<input type="number" id="qualifyingPay" disabled value="${qualifyingPay}" />
<input type="hidden" class="statusValue" disabled value="${status}" />
`;

    // Append the HTML to the third block (blocks[2]) if it exists, else update its value
    if (blocks.length >= 3) {
        const block = blocks[2];
        const existingInput = block.querySelector('#qualifyingPay');
        if (existingInput) {
            existingInput.value = qualifyingPay;
        } else {
            block.insertAdjacentHTML('beforeend', html);
        }
    }
}

// Self Employed Section Starts 
let SoleProprietorScheduleC = document.getElementById('SoleProprietorScheduleC');
let CCorporation1120 = document.getElementById("CCorporation1120");
let SCorporation1120S = document.getElementById("SCorporation1120S");
let Partnership1065 = document.getElementById('Partnership1065');

function changeBusinessStructure() {
    const block = document.getElementById("selfEmployedSection");
    const employmentHistory = currentEmploymentDates;
    const weeksByYearEmploymentHistory = separateWeeksByYear(employmentHistory);
    if (currentEmployementExists && Object.keys(weeksByYearEmploymentHistory).length >= 3) {
        block.querySelector('.errMessage').style.display = "none";
        let businessStructureSelect = document.getElementById('businessStructureSelect');
        if (businessStructureSelect.value === "Sole Proprietor Schedule C") {
            SoleProprietorScheduleC.style.display = "block";
            CCorporation1120.style.display = "none";
            SCorporation1120S.style.display = "none";
            Partnership1065.style.display = "none";

        }
        else if (businessStructureSelect.value === "C Corporation - 1120") {
            SoleProprietorScheduleC.style.display = "none";
            CCorporation1120.style.display = "block";
            SCorporation1120S.style.display = "none";
            Partnership1065.style.display = "none";

        }
        else if (businessStructureSelect.value === "S Corporation - 1120S") {
            SoleProprietorScheduleC.style.display = "none";
            CCorporation1120.style.display = "none";
            SCorporation1120S.style.display = "block";
            Partnership1065.style.display = "none";

        }
        else if (businessStructureSelect.value === "Partnership - 1065") {
            SoleProprietorScheduleC.style.display = "none";
            CCorporation1120.style.display = "none";
            SCorporation1120S.style.display = "none";
            Partnership1065.style.display = "block";

        }

    }
    else {
        block.querySelector('.errMessage').style.display = "block";


    }


}

// SoleProprietorScheduleC In self Employed Section :
function calculateTotalEarningsSelfEmployed() {
    let block = document.getElementById('SoleProprietorScheduleC');

    const fields = [
        "net_profit_2023", "net_profit_2022",
        "nonrecurring_income_2023", "nonrecurring_income_2022",
        "depletion_2023", "depletion_2022",
        "depreciation_2023", "depreciation_2022",
        "mileage_2023", "mileage_2022",
        "meals_entertainment_2023", "meals_entertainment_2022",
        "Casualty_Loss_2023", "Casualty_Loss_2022",
        "business_use_home_2023", "business_use_home_2022"
    ];

    let values = {};
    let allFieldsFilled = true;

    fields.forEach(field => {
        let input = document.getElementsByName(field)[0];
        let value = input ? input.value : '';
        if (value === '') {
            allFieldsFilled = false;
        }
        values[field] = parseFloat(value) || 0;
    });

    if (!allFieldsFilled) {
        alert("Please fill in all input fields.");
        return;
    }

    const calculateTotalEarnings = (netProfit, nonrecurringIncome, depletion, depreciation, mileage, mealsEntertainment, casualtyLoss, businessUseHome) => {
        return netProfit - nonrecurringIncome +
            depletion + depreciation + (mileage * 0.28) -
            mealsEntertainment + casualtyLoss + businessUseHome;
    };

    let totalEarnings2023 = calculateTotalEarnings(
        values.net_profit_2023, values.nonrecurring_income_2023,
        values.depletion_2023, values.depreciation_2023,
        values.mileage_2023, values.meals_entertainment_2023,
        values.Casualty_Loss_2023, values.business_use_home_2023
    );

    let totalEarnings2022 = calculateTotalEarnings(
        values.net_profit_2022, values.nonrecurring_income_2022,
        values.depletion_2022, values.depreciation_2022,
        values.mileage_2022, values.meals_entertainment_2022,
        values.Casualty_Loss_2022, values.business_use_home_2022
    );

    // Display results
    block.querySelector('.selfEmployee-earning23').value = totalEarnings2023.toFixed(2);
    block.querySelector('.selfEmployee-earning22').value = totalEarnings2022.toFixed(2);

    // Calculate and display monthly income (assuming 12 months)
    block.querySelector('.selfEmployee-Monthlyearning23').value = (totalEarnings2023 / 12).toFixed(2);
    block.querySelector('.selfEmployee-Monthlyearning22').value = (totalEarnings2022 / 12).toFixed(2);

    // Calculate and display 2-year average
    let average = ((totalEarnings2023 + totalEarnings2022) / 24).toFixed(2);
    block.querySelector('.selfEmployee-2YearAverage').value = average;

    // Show the result section
    block.querySelector('.selfemployeeResult').style.display = 'block';
}


// CCorporation1120 In self Employed Section :

function calculateTotalIncomeCCorporation() {
    let block = document.getElementById('CCorporation1120');
    const fields = [
        "wages_amount_2023", "wages_amount_2022",
        "capital_gain_amount_2023", "capital_gain_amount_2022",
        "net_gain_loss_amount_2023", "net_gain_loss_amount_2022",
        "other_income_loss_amount_2023", "other_income_loss_amount_2022",
        "depreciation_amount_2023", "depreciation_amount_2022",
        "depreciation_1120_amount_2023", "depreciation_1120_amount_2022",
        "depletion_amount_2023", "depletion_amount_2022",
        "domestic_production_amount_2023", "domestic_production_amount_2022",
        "net_operating_loss_amount_2023", "net_operating_loss_amount_2022",
        "other_1120_amount_2023", "other_1120_amount_2022",
        "special_deduction_amount_2023", "special_deduction_amount_2022",
        "taxable_income_amount_2023", "taxable_income_amount_2022",
        "total_tax_amount_2023", "total_tax_amount_2022",
        "mortgages_notes_bonds_amount_2023", "mortgages_notes_bonds_amount_2022",
        "travel_entertainment_amount_2023", "travel_entertainment_amount_2022",
        "dividend_cash_amount_2023", "dividend_cash_amount_2022",
        "dividend_stock_amount_2023", "dividend_stock_amount_2022",
        "dividend_property_amount_2023", "dividend_property_amount_2022"
    ];

    let values = {};
    let allFieldsFilled = true;

    fields.forEach(field => {
        let input = document.getElementsByName(field)[0];
        let value = input ? input.value : '';
        if (value === '') {
            allFieldsFilled = false;
        }
        values[field] = parseFloat(value) || 0;
    });

    if (!allFieldsFilled) {
        alert("Please fill in all fields.");
        return; // Stop further execution if any field is empty
    }

    let totalIncome2023 = values.wages_amount_2023 + values.capital_gain_amount_2023 + values.net_gain_loss_amount_2023 -
        values.other_income_loss_amount_2023 + values.depreciation_amount_2023 + values.depreciation_1120_amount_2023 +
        values.depletion_amount_2023 + values.domestic_production_amount_2023 + values.other_1120_amount_2023 +
        values.net_operating_loss_amount_2023 + values.special_deduction_amount_2023 + values.taxable_income_amount_2023 -
        values.total_tax_amount_2023 - values.mortgages_notes_bonds_amount_2023 - values.travel_entertainment_amount_2023 -
        values.dividend_cash_amount_2023 - values.dividend_stock_amount_2023 - values.dividend_property_amount_2023;

    let totalIncome2022 = values.wages_amount_2022 + values.capital_gain_amount_2022 + values.net_gain_loss_amount_2022 -
        values.other_income_loss_amount_2022 + values.depreciation_amount_2022 + values.depreciation_1120_amount_2022 +
        values.depletion_amount_2022 + values.domestic_production_amount_2022 + values.other_1120_amount_2022 +
        values.net_operating_loss_amount_2022 + values.special_deduction_amount_2022 + values.taxable_income_amount_2022 -
        values.total_tax_amount_2022 - values.mortgages_notes_bonds_amount_2022 - values.travel_entertainment_amount_2022 -
        values.dividend_cash_amount_2022 - values.dividend_stock_amount_2022 - values.dividend_property_amount_2022;

    let monthlyIncome2023 = totalIncome2023 / 12;
    let monthlyIncome2022 = totalIncome2022 / 12;
    let twoYearAverage = (totalIncome2023 + totalIncome2022) / 24;

    // Display results
    block.querySelector('.selfEmployee-earning23').value = totalIncome2023;
    block.querySelector('.selfEmployee-Monthlyearning23').value = monthlyIncome2023;
    block.querySelector('.selfEmployee-earning22').value = totalIncome2022;
    block.querySelector('.selfEmployee-Monthlyearning22').value = monthlyIncome2022;
    block.querySelector('.selfEmployee-2YearAverage').value = twoYearAverage;
    // Show the result box
    block.querySelector('.selfemployeeResult').style.display = 'block';
}


// SCorporation1120S In self Employed Section :

function calculateTotalEarningsSCorp() {
    let block = document.getElementById('SCorporation1120S');

    // Retrieve values from input fields
    const fields = [
        "wages_2023", "wages_2022",
        "ordinary_income_2023", "ordinary_income_2022",
        "rental_income_2023", "rental_income_2022",
        "other_rental_income_2023", "other_rental_income_2022",
        "distributions_2023", "distributions_2022",
        "contributions_2023", "contributions_2022",
        "net_gain_2023", "net_gain_2022",
        "other_income_2023", "other_income_2022",
        "depreciation_1120S_2023", "depreciation_1120S_2022",
        "depreciation_8825_2023", "depreciation_8825_2022",
        "depletion_2023", "depletion_2022",
        "other_2023", "other_2022",
        "mortgages_2023", "mortgages_2022",
        "travel_entertainment_2023", "travel_entertainment_2022",
        "months_in_service_2023", "months_in_service_2022",
        "percent_ownership_2023", "percent_ownership_2022"
    ];

    let values = {};
    let allFieldsFilled = true;

    fields.forEach(field => {
        let input = block.querySelector(`[name="${field}"]`);
        let value = input ? input.value : '';
        if (value === '') {
            allFieldsFilled = false;
        }
        values[field] = parseFloat(value) || 0;
    });

    if (!allFieldsFilled) {
        alert("Please fill in all fields.");
        return; // Stop further execution if any field is empty
    }

    // Populate 2023 Inputs
    let k1Lines23 = values.ordinary_income_2023 + values.rental_income_2023 + values.other_rental_income_2023;
    let cashFlowAdjustment23 = values.net_gain_2023 + values.other_income_2023 + values.depreciation_1120S_2023 + values.depreciation_8825_2023;
    let k1CalculatedIncome23 = (values.wages_2023 + k1Lines23 + cashFlowAdjustment23) * (values.percent_ownership_2023 / 100);
    let distributedK1CalculatedIncome23 = values.wages_2023 + values.distributions_2023 + values.contributions_2023;

    block.querySelector('.sCorp-earning23').value = values.wages_2023;
    block.querySelector('.sCorp-K1Lines23').value = k1Lines23;
    block.querySelector('.sCorp-CashFlowAdjustment23').value = cashFlowAdjustment23;
    block.querySelector('.sCorp-DistributedW2Income23').value = values.wages_2023;
    block.querySelector('.sCorp-DistributionslessContributions23').value = values.distributions_2023 + values.contributions_2023;
    block.querySelector('.sCorp-K1CalculatedIncome23').value = k1CalculatedIncome23;
    block.querySelector('.sCorp-MonthlyIncome23').value = k1CalculatedIncome23 / 12;
    block.querySelector('.sCorp-DistributedK1CalculatedIncome23').value = distributedK1CalculatedIncome23;
    block.querySelector('.sCorp-DistributedMonthlyIncome23').value = distributedK1CalculatedIncome23 / 12;

    // Populate 2022 Inputs
    let k1Lines22 = values.ordinary_income_2022 + values.rental_income_2022 + values.other_rental_income_2022;
    let cashFlowAdjustment22 = values.net_gain_2022 + values.other_income_2022 + values.depreciation_1120S_2022 + values.depreciation_8825_2022;
    let k1CalculatedIncome22 = (values.wages_2022 + k1Lines22 + cashFlowAdjustment22) * (values.percent_ownership_2022 / 100);
    let distributedK1CalculatedIncome22 = values.wages_2022 + values.distributions_2022 + values.contributions_2022;

    block.querySelector('.sCorp-earning22').value = values.wages_2022;
    block.querySelector('.sCorp-K1Lines22').value = k1Lines22;
    block.querySelector('.sCorp-CashFlowAdjustment22').value = cashFlowAdjustment22;
    block.querySelector('.sCorp-DistributedW2Income22').value = values.wages_2022;
    block.querySelector('.sCorp-DistributionslessContributions22').value = values.distributions_2022 + values.contributions_2022;
    block.querySelector('.sCorp-K1CalculatedIncome22').value = k1CalculatedIncome22;
    block.querySelector('.sCorp-MonthlyIncome22').value = k1CalculatedIncome22 / 12;
    block.querySelector('.sCorp-DistributedK1CalculatedIncome22').value = distributedK1CalculatedIncome22;
    block.querySelector('.sCorp-DistributedMonthlyIncome22').value = distributedK1CalculatedIncome22 / 12;

    // Show the result section
    block.querySelector('.sCorpResult').style.display = 'block';
}


// Partnership1065 In self Employed Section :
function calculateTotalEarningsPartnership() {
    // Retrieve the block containing Partnership1065 elements
    let block = document.getElementById('Partnership1065');

    // Retrieve values from input fields
    const fields = [
        "wages_2023", "wages_2022",
        "ordinary_income_2023", "ordinary_income_2022",
        "rental_income_2023", "rental_income_2022",
        "other_rental_income_2023", "other_rental_income_2022",
        "guaranteed_payments_2023", "guaranteed_payments_2022",
        "distributions_2023", "distributions_2022",
        "contributions_2023", "contributions_2022",
        "ordinary_income_1065_2023", "ordinary_income_1065_2022",
        "net_farm_profit_2023", "net_farm_profit_2022",
        "net_gain_form_4797_2023", "net_gain_form_4797_2022",
        "other_income_1065_2023", "other_income_1065_2022",
        "depreciation_1065_2023", "depreciation_1065_2022",
        "depletion_1065_2023", "depletion_1065_2022",
        "amortization_loss_2023", "amortization_loss_2022",
        "mortgages_notes_bonds_2023", "mortgages_notes_bonds_2022",
        "travel_entertainment_2023", "travel_entertainment_2022",
        "months_in_service_2023", "months_in_service_2022",
        "percent_ownership_2023", "percent_ownership_2022",
        "w2_income_2023", "w2_income_2022",
        "k1_lines_123_2023", "k1_lines_123_2022",
        "cash_flow_adjustments_2023", "cash_flow_adjustments_2022",
        "guaranteed_payments_k1_2023", "guaranteed_payments_k1_2022"
    ];

    let values = {};
    let allFieldsFilled = true;

    fields.forEach(field => {
        let input = block.querySelector(`[name="${field}"]`);
        let value = input ? input.value : '';
        if (value === '') {
            allFieldsFilled = false;
        }
        values[field] = parseFloat(value) || 0;
    });

    if (!allFieldsFilled) {
        alert("Please fill in all fields.");
        return; // Stop further execution if any field is empty
    }

    // Populate 2023 Inputs
    block.querySelector('.partnership-earning23').value = values.wages_2023;
    block.querySelector('.partnership-DistributionsLessContributions23').value = values.distributions_2023 - values.contributions_2023;
    block.querySelector('.partnership-GuaranteedPayments23').value = values.guaranteed_payments_2023;
    block.querySelector('.partnership-K1CalculatedIncome23').value =
        values.w2_income_2023 + values.k1_lines_123_2023 +
        values.cash_flow_adjustments_2023 + values.guaranteed_payments_k1_2023;
    block.querySelector('.partnership-MonthlyIncome23').value =
        (values.w2_income_2023 + values.k1_lines_123_2023 +
            values.cash_flow_adjustments_2023 + values.guaranteed_payments_k1_2023) / 12;
    block.querySelector('.partnership-DistributedK1CalculatedIncome23').value =
        values.wages_2023 + (values.distributions_2023 - values.contributions_2023) +
        values.guaranteed_payments_k1_2023;
    block.querySelector('.partnership-DistributedMonthlyIncome23').value =
        (values.wages_2023 + (values.distributions_2023 - values.contributions_2023) +
            values.guaranteed_payments_k1_2023) / 12;

    // Populate 2022 Inputs
    block.querySelector('.partnership-earning22').value = values.wages_2022;
    block.querySelector('.partnership-DistributionsLessContributions22').value = values.distributions_2022 - values.contributions_2022;
    block.querySelector('.partnership-GuaranteedPayments22').value = values.guaranteed_payments_2022;
    block.querySelector('.partnership-K1CalculatedIncome22').value =
        values.w2_income_2022 + values.k1_lines_123_2022 +
        values.cash_flow_adjustments_2022 + values.guaranteed_payments_k1_2022;
    block.querySelector('.partnership-MonthlyIncome22').value =
        (values.w2_income_2022 + values.k1_lines_123_2022 +
            values.cash_flow_adjustments_2022 + values.guaranteed_payments_k1_2022) / 12;
    block.querySelector('.partnership-DistributedK1CalculatedIncome22').value =
        values.wages_2022 + (values.distributions_2022 - values.contributions_2022) +
        values.guaranteed_payments_k1_2022;
    block.querySelector('.partnership-DistributedMonthlyIncome22').value =
        (values.wages_2022 + (values.distributions_2022 - values.contributions_2022) +
            values.guaranteed_payments_k1_2022) / 12;

    // Display results block
    block.querySelector('.partnershipResult').style.display = "block";
}
