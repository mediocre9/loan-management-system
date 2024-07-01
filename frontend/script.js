<!-- changed onblur to onblur event -->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Logic Links</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment-with-locales.min.js" integrity="sha512-4F1cxYdMiAW98oomSLaygEwmCnIP38pb4Kx70yQYqRwLVCs3DbRumfBq82T08g/4LJ/smbFGFpmeFlQgoDccgg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .input-field {
            width: 100%;
            box-sizing: border-box;
        }
    </style>
</head>

<body>
    <div id="svg_wrap"></div>
    <h1>Logic Links</h1>
    <section>
        <p class="q-text">Please enter employment history. Must put at least 2 years.</p>
        <div id="additionalEmploymentContainer">
            <div class="additionalEmploymentBlock">
                <strong class="strongSubHeading">Current Employer</strong>
                <input type="text" class="additionalBorrowerName" onblur="ValidateInputs(this,event)" placeholder="Borrower Name" />
                <input type="text" class="additionalEmployerName" placeholder="Employer Name" onblur="ValidateInputs(this,event)" />

                <input type="text" class="additionalPosition" placeholder="Position" onblur="ValidateInputs(this,event)" />
                <div style="display: flex; align-items: center">
                    <input type="checkbox" name="" class="CurrenPositionCheck" style="width: 17px; height: 20px; margin-right: 10px" onblur="currentJob(this)" />
                    <label for="CurrenPositionCheck">Current Position</label>
                </div>
                <input onfocus="(this.type='date')" onblur="ValidateInputs(this,event)" class="additionalStartDate" placeholder="Start Date" />
                <input onfocus="(this.type='date')" onblur="ValidateInputs(this,event)" class="additionalEndDate" placeholder="End Date" />

                <p class="errorMessage"></p>
            </div>
        </div>
        <!-- School-related fields block -->
        <template id="schoolFieldsTemplate">
            <div class="schoolFields">
                <strong class="strongSubHeading">School Details</strong>
                <input type="text" class="SchoolName" placeholder="School Name" />
                <input type="text" class="Degree" placeholder="Degree" />
                <input onfocus="(this.type='date')" onblur="checkDateRange()" class="additionalStartDate" placeholder="Start Date" />
                <input onfocus="(this.type='date')" onblur="checkDateRange()" class="additionalEndDate" placeholder="End Date" />
                <p class="errorMessage"></p>
            </div>
        </template>
        <div id="schoolTogl" style="display: none">
            <div style="display: flex; align-items: center">
                <input type="checkbox" id="SchoolChecker" style="width: 17px; height: 20px; margin-right: 10px" onblur="toggleSchoolFields(this)" />
                <div>I Was in School ! No Previous Employment</div>
            </div>
        </div>
    </section>

    <section>
        <p class="q-text">What Is Your Main Source of Income?</p>
        <strong class="strongSubHeading">Source of Income</strong>
        <select name="" id="SourceOfIncomeSelect" onblur="sourceOfIncome()">
            <option value="Salary" selected>
                Salary
            </option>
            <option value="Hourly">Hourly</option>
            <option value="Variable income">Variable</option>
            <option value="Self-employed">Self-employed</option>
        </select>
    </section>

    <section>
        <div id="salarySection">
            <p class="q-text">Please fill the following fields.</p>
            <div id="salleryBlockContainer">
                <div class="SalaryBlocks">
                    <strong class="strongSubHeading" style="margin-bottom: 10px">Salary</strong>
                    <label for="">Pay Period Start Date </label>
                    <input placeholder="Pay Period Start Date" onfocus="(this.type='date')" onblur="validateSalaryInputs(this,event)" class="SalaryStartDate" />
                    <label for="">Pay Period End Date</label>
                    <input placeholder="Pay Period End Date" onfocus="(this.type='date')" onblur="validateSalaryInputs(this,event)" class="SalaryEndDate" />
                    <label for="">Current Gross Base Pay</label>
                    <input type="number" placeholder="Current Gross Base Pay" class="currentGrossPay" onblur="validateSalaryInputs(this,event)" />
                    <label for="">YTD Gross Base Pay</label>
                    <input type="number" placeholder="YTD Gross Base Pay" class="YTDGrossPays" onblur="validateSalaryInputs(this,event)" />
                    <div class="consoleData" style="display: none">
                        <input type="hidden" class="newYTD" />
                        <label for="">Validated Income</label>
                        <input type="hidden" class="newIncome" />
                        <label for="">Multiplier</label>
                        <input type="hidden" class="newmultipier" />
                    </div>
                    <p class="filledMessage"></p>
                </div>
            </div>
            <div class="pIntenvalBox" style="display: none">
                <select name="pIntenval" class="pIntenval" onblur="updateMultiplier(this)">
                    <option value="Bi-Weekly">Select Pay period Interval</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="2x Per Month">2x Per Month</option>
                </select>
            </div>
        </div>
        <div id="hourlySection" style="display: none">
            <p class="q-text">Please fill the following fields.</p>
            <div id="hourlyBlockContainer">
                <div class="hourlyBlocks">
                    <strong class="strongSubHeading" style="margin-bottom: 10px">Hourly</strong>
                    <label for="">Pay Period Start Date </label>
                    <input onfocus="(this.type='date')" onblur="validateHourlyInputs(this,event)" class="hourlyStartDate" />
                    <label for="">Pay Period End Date</label>
                    <input onfocus="(this.type='date')" onblur="validateHourlyInputs(this,event)" class="hourlyEndDate" />
                    <label for="">Hourly Rate</label>
                    <input type="number" class="hourlyRate" onblur="validateHourlyInputs(this,event)" />
                    <label for="">Current Hours Base Pay (include Holiday, Sick, PTO)</label>
                    <input type="number" class="currentHourBasePay" onblur="validateHourlyInputs(this,event)" />
                    <label for="">Current Gross Base Pay (include Holiday, Sick, PTO)</label>
                    <input type="number" class="currentGrossBasePay-hourly" onblur="validateHourlyInputs(this,event)" />
                    <label for="">YTD Hours (include Holiday, Sick, PTO)</label>
                    <input type="number" class="YTDhour-hourly" onblur="validateHourlyInputs(this,event)" />
                    <label for="">YTD Gross Base Pay (include Holiday, Sick, PTO)</label>
                    <input type="number" class="ytdGrossBasePay-hourly" onblur="validateHourlyInputs(this,event)" />
                    <div class="hourlyConsole" style="display: none">
                        <label for="">checkHourlyRate</label>
                        <input type="number" class="checkHourlyRate-Field" onblur="validateHourlyInputs(this,event)" />
                        <label for="">paychecksYTD</label>
                        <input type="number" class="paychecksYTD-Field" onblur="validateHourlyInputs(this,event)" />
                        <label for="">expectedYTDHour</label>
                        <input type="number" class="expectedYTDHour-Field" onblur="validateHourlyInputs(this,event)" />
                        <label for="">Income</label>
                        <input type="number" class="income-Field" onblur="validateHourlyInputs(this,event)" />
                    </div>
                    <p class="filledMessage"></p>
                </div>
            </div>
            <div class="pIntenvalBox2" style="display: none">
                <select name="pIntenval" class="pIntenval" onblur="updateFrequency(this)">
                    <option value="Bi-Weekly">Select Pay period Interval</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="2x Per Month">2x Per Month</option>
                </select>
            </div>
            <div class="reasonBox" style="display: none">
                <label for="">What was the reason for less than 40 hours?</label>
                <select name="" id="reasonPerson">
                    <option value="Borrower" selected>
                        Borrower
                    </option>
                    <option value="Employer">Employer</option>
                </select>
                <label for="">Explanation</label>
                <textarea name="" id="" rows="6" placeholder="Write a detail LOX"></textarea>

                <div class="yearCollection"></div>
            </div>
        </div>
        <div id="variableSection" style="display: none">
            <div class="basePayQuestion">
                <p>Do you have a base salary pay?</p>
                <select name="" id="basePayQuestionSelect" onblur="basePayQuestion()">
                    <option value="Yes">base salary pay</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
            <div id="basePaySalary" style="display: none">
                <strong>Base Pay Salary</strong>
                <div>
                    <label for="">Current Rate of Pay</label>
                    <input type="number" class="currentRateOfPay" onblur="calcBasePay()" />
                    <label for="">Pay frequency</label>
                    <select class="payFrequencyInVar" onblur="calcBasePay()">
                        <option value="Yearly" selected>
                            Yearly
                        </option>
                        <option value="Monthly">Monthly</option>
                        <option value="Bi-Monthly">Bi-Monthly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-Weekly">Bi-Weekly</option>
                        <option value="Hourly">Hourly</option>
                    </select>
                    <div class="clacResults" style="display: none">
                        <label for="">Yearly Earning</label>
                        <input type="number" class="yearlyEarning" disabled />
                        <label for="">Monthly Earning</label>
                        <input type="number" class="monthlyEarning" disabled />
                    </div>
                </div>
                <div class="Ytdand2year"></div>
                <a href="javascript:void(0)" style="
                            width: 140px;
                            background-color: #1ab188;
                            color: #fff;
                            text-decoration: none;
                            border-radius: 5px;
                            height: 38px;
                            line-height: 38px;
                            display: inline-block;
                            text-align: center;
                            margin-top: 10px;
                        " onclick="salleryToBasePay()">
                    Submit
                </a>
            </div>
            <style>
                /* Style for checkbox container */
                .checkbox-container {
                    display: flex;
                    flex-direction: column;
                }

                /* Style for checkbox label */
                .checkbox-label {
                    display: inline-flex;
                    align-items: center;
                    margin-right: 20px;
                }

                /* Style for custom checkbox */
                .custom-checkbox {
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    width: 16px;
                    height: 16px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    outline: none;
                    cursor: pointer;
                    margin-right: 8px;
                    padding: 8px !important;
                }

                /* Style for custom checkbox when checked */
                .custom-checkbox:checked {
                    background-color: #1ab188;
                    border-color: #1ab188;
                }

                /* Style for custom checkbox label text */
                .checkbox-text {
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    color: #333;
                }
            </style>
            <div class="wrpper-basePay" style="display: none">
                <div id="varPay">
                    <strong style="margin-top: 10px; display: inline-block">What type of variable pay do we have?</strong>
                    <p style="margin-top: 5px; margin-bottom: 5px">You should be able to check all that apply</p>
                    <form class="checkbox-container">
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="OT" />
                            <span class="checkbox-text">OT</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Commission" />
                            <span class="checkbox-text">Commission</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Bonus" />
                            <span class="checkbox-text">Bonus</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Shift" />
                            <span class="checkbox-text">Shift</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Weekend" />
                            <span class="checkbox-text">Weekend</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Holiday" />
                            <span class="checkbox-text">Holiday</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Per Load" />
                            <span class="checkbox-text">Per Load</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Per Mile" />
                            <span class="checkbox-text">Per Mile</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Tips" />
                            <span class="checkbox-text">Tips</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Percentage" />
                            <span class="checkbox-text">Percentage</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Stop Pay" />
                            <span class="checkbox-text">Stop Pay</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Detention Pay" />
                            <span class="checkbox-text">Detention Pay</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="custom-checkbox" name="compensation" value="Accessorial Pay" />
                            <span class="checkbox-text">Accessorial Pay</span>
                        </label>
                    </form>
                </div>
                <div id="varBoxOnPay">
                    <div class="renderBasePay"></div>
                </div>
            </div>
        </div>
        <div id="selfEmployedSection" style="display: none">
            <p class="q-text">What is your business structure?</p>

            <select name="" id="businessStructureSelect" onblur="changeBusinessStructure()">
                <option value="" selected>
                    Select Business Structure
                </option>
                <option value="Sole Proprietor Schedule C">Sole Proprietor Schedule C</option>
                <option value="C Corporation - 1120">C Corporation - 1120</option>
                <option value="S Corporation - 1120S">S Corporation - 1120S</option>
                <option value="Partnership - 1065">Partnership - 1065</option>
            </select>
            <p class="errMessage" style="display: none; color: #128062">
                self-employment must be 2 years, no previous employment
            </p>
            <div id="SoleProprietorScheduleC" style="display: none">
                <h1>Schedule C - 1040</h1>
                <form>
                    <table>
                        <thead>
                            <tr>
                                <th>Labels</th>
                                <th>2023</th>
                                <th>2022</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Net Profit (or Loss) - Line 31</td>
                                <td>
                                    <input type="number" class="input-field" name="net_profit_2023" value="85000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="net_profit_2022" value="75000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Nonrecurring Other Income - Part 1, Line 6</td>
                                <td>
                                    <input type="number" class="input-field" name="nonrecurring_income_2023" value="1500" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="nonrecurring_income_2022" value="0" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depletion - Line 12</td>
                                <td>
                                    <input type="number" class="input-field" name="depletion_2023" value="2500" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depletion_2022" value="3500" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depreciation - Line 13</td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_2023" value="1500" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_2022" value="1700" />
                                </td>
                            </tr>
                            <tr>
                                <td>Mileage - Part IV, Line 44a</td>
                                <td>
                                    <input type="number" class="input-field" name="mileage_2023" value="1400" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="mileage_2022" value="0" />
                                </td>
                            </tr>
                            <tr>
                                <td>Meals & Entertainment - Line 24B</td>
                                <td>
                                    <input type="number" class="input-field" name="meals_entertainment_2023" value="1500" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="meals_entertainment_2022" value="1800" />
                                </td>
                            </tr>
                            <tr>
                                <td>Amortization & Casualty Loss - Line 27a (Part V)</td>
                                <td>
                                    <input type="number" class="input-field" name="Casualty_Loss_2023" value="0" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="Casualty_Loss_2022" value="0" />
                                </td>
                            </tr>
                            <tr>
                                <td>Business Use of Home - Line 30</td>
                                <td>
                                    <input type="number" class="input-field" name="business_use_home_2023" value="8500" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="business_use_home_2022" value="8500" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="javascript:void(0)" class="selfEmp-Sub-Btn" onclick="calculateTotalEarningsSelfEmployed()">
                        Submit
                    </a>

                    <div class="selfemployeeResult" style="display: none">
                        <strong>2023</strong>
                        <label for="">Total Yearly Income</label>
                        <input type="number" disabled class="selfEmployee-earning23" />
                        <label for="">Monthly Income</label>
                        <input type="number" disabled class="selfEmployee-Monthlyearning23" />
                        <strong>2022</strong>
                        <label for="">Total Yearly Income</label>
                        <input type="number" disabled class="selfEmployee-earning22" />
                        <label for="">Monthly Income</label>
                        <input type="number" disabled class="selfEmployee-Monthlyearning22" />

                        <strong>2 year Average</strong>
                        <input type="number" disabled class="selfEmployee-2YearAverage" />
                    </div>
                </form>
            </div>
            <div id="CCorporation1120" style="display: none">
                <h1>C Corporation - 1120</h1>
                <form>
                    <table>
                        <thead>
                            <tr>
                                <th>Labels</th>
                                <th>2023</th>
                                <th>2022</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Wages: W-2, Box 5</td>
                                <td>
                                    <input type="number" class="input-field" name="wages_amount_2023" value="45000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="wages_amount_2022" value="45000" />
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <h3 style="text-align: center">Business Income</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>Capital Gain Income or Loss</td>
                                <td>
                                    <input type="number" class="input-field" name="capital_gain_amount_2023" value="35000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="capital_gain_amount_2022" value="35000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Net Gain or Loss (Form 4797)</td>
                                <td>
                                    <input type="number" class="input-field" name="net_gain_loss_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="net_gain_loss_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Other Income or Loss</td>
                                <td>
                                    <input type="number" class="input-field" name="other_income_loss_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="other_income_loss_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depreciation</td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depreciation 1120</td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_1120_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_1120_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depletion</td>
                                <td>
                                    <input type="number" class="input-field" name="depletion_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depletion_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Domestic Production Activities</td>
                                <td>
                                    <input type="number" class="input-field" name="domestic_production_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="domestic_production_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Other - 1120</td>
                                <td>
                                    <input type="number" class="input-field" name="other_1120_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="other_1120_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Net Operating Loss</td>
                                <td>
                                    <input type="number" class="input-field" name="net_operating_loss_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="net_operating_loss_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Special Deduction</td>
                                <td>
                                    <input type="number" class="input-field" name="special_deduction_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="special_deduction_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Taxable Income</td>
                                <td>
                                    <input type="number" class="input-field" name="taxable_income_amount_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="taxable_income_amount_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Total Tax</td>
                                <td>
                                    <input type="number" class="input-field" name="total_tax_amount_2023" value="10000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="total_tax_amount_2022" value="10000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Mortgages, Notes, Bonds payable in less than 1 year</td>
                                <td>
                                    <input type="number" class="input-field" name="mortgages_notes_bonds_amount_2023" value="10000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="mortgages_notes_bonds_amount_2022" value="10000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Travel & Entertainment</td>
                                <td>
                                    <input type="number" class="input-field" name="travel_entertainment_amount_2023" value="10000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="travel_entertainment_amount_2022" value="10000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Dividend Cash</td>
                                <td>
                                    <input type="number" class="input-field" name="dividend_cash_amount_2023" value="10000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="dividend_cash_amount_2022" value="10000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Dividend Stock</td>
                                <td>
                                    <input type="number" class="input-field" name="dividend_stock_amount_2023" value="10000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="dividend_stock_amount_2022" value="10000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Dividend Property</td>
                                <td>
                                    <input type="number" class="input-field" name="dividend_property_amount_2023" value="10000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="dividend_property_amount_2022" value="10000" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="javascript:void(0)" class="selfEmp-Sub-Btn" onclick="calculateTotalIncomeCCorporation()">
                        Submit
                    </a>
                    <div class="selfemployeeResult" style="display: none">
                        <strong>2023</strong>
                        <label for="">Total Yearly Income</label>
                        <input type="number" disabled class="selfEmployee-earning23" />
                        <label for="">Monthly Income</label>
                        <input type="number" disabled class="selfEmployee-Monthlyearning23" />
                        <strong>2022</strong>
                        <label for="">Total Yearly Income</label>
                        <input type="number" disabled class="selfEmployee-earning22" />
                        <label for="">Monthly Income</label>
                        <input type="number" disabled class="selfEmployee-Monthlyearning22" />

                        <strong>2 year Average</strong>
                        <input type="number" disabled class="selfEmployee-2YearAverage" />
                    </div>
                </form>
                <p class="errMessage" style="display: none; color: #128062">
                    self-employment must be 2 years, no previous employment
                </p>
            </div>
            <div id="SCorporation1120S" style="display: none">
                <h1>S Corporation - 1120S</h1>
                <form>
                    <table>
                        <thead>
                            <tr>
                                <th>Labels</th>
                                <th>2023</th>
                                <th>2022</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Form W-2 -->
                            <tr>
                                <td colspan="3">
                                    <h3>Form W-2</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>Wages: W-2, Box 5</td>
                                <td>
                                    <input type="number" class="input-field" name="wages_2023" value="45000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="wages_2022" value="45000" />
                                </td>
                            </tr>

                            <!-- Individual Income -->
                            <tr>
                                <td colspan="3">
                                    <h3>Individual Income</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>Ordinary Business Income or Loss - K1 Line 1</td>
                                <td>
                                    <input type="number" class="input-field" name="ordinary_income_2023" value="25000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="ordinary_income_2022" value="25000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Net Rental Income or Loss - K1 Line 2</td>
                                <td>
                                    <input type="number" class="input-field" name="rental_income_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="rental_income_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Other Rental Income or Loss - K1 Line 3</td>
                                <td>
                                    <input type="number" class="input-field" name="other_rental_income_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="other_rental_income_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Distributions - K1 Line 16D</td>
                                <td>
                                    <input type="number" class="input-field" name="distributions_2023" value="20000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="distributions_2022" value="20000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Contributions</td>
                                <td>
                                    <input type="number" class="input-field" name="contributions_2023" value="-5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="contributions_2022" value="-5000" />
                                </td>
                            </tr>

                            <!-- Business Income -->
                            <tr>
                                <td colspan="3">
                                    <h3>Business Income</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>Net Gain Form 4797 - 1120S Line 4</td>
                                <td>
                                    <input type="number" class="input-field" name="net_gain_2023" value="1" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="net_gain_2022" value="1" />
                                </td>
                            </tr>
                            <tr>
                                <td>Other Income or Loss - 1120S Line 5</td>
                                <td>
                                    <input type="number" class="input-field" name="other_income_2023" value="1" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="other_income_2022" value="1" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depreciation - 1120S Line 14</td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_1120S_2023" value="1" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_1120S_2022" value="1" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depreciation - 8825 Line 14</td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_8825_2023" value="1" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_8825_2022" value="1" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depletion - 1120S Line 15</td>
                                <td>
                                    <input type="number" class="input-field" name="depletion_2023" value="1" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depletion_2022" value="1" />
                                </td>
                            </tr>
                            <tr>
                                <td>Other - 1120S Line 19</td>
                                <td>
                                    <input type="number" class="input-field" name="other_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="other_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Mortgages, Notes, Bonds Payable in less than 1 year - Schedule L Line 17D</td>
                                <td>
                                    <input type="number" class="input-field" name="mortgages_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="mortgages_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Travel & Entertainment - Schedule M-1 Line 3B</td>
                                <td>
                                    <input type="number" class="input-field" name="travel_entertainment_2023" value="-5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="travel_entertainment_2022" value="-5000" />
                                </td>
                            </tr>

                            <!-- Other Information -->
                            <tr>
                                <td colspan="3">
                                    <h3>Other Information</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>Months in Service</td>
                                <td>
                                    <input type="number" class="input-field" name="months_in_service_2023" value="12" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="months_in_service_2022" value="12" />
                                </td>
                            </tr>
                            <tr>
                                <td>Percent Ownership</td>
                                <td>
                                    <input type="number" class="input-field" name="percent_ownership_2023" value="100" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="percent_ownership_2022" value="100" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="javascript:void(0)" class="selfEmp-Sub-Btn" onclick="calculateTotalEarningsSCorp()">
                        Submit
                    </a>

                    <div class="sCorpResult" style="display: none">
                        <strong>2023</strong>
                        <strong>K1 Income</strong>
                        <label>W2 Income</label>
                        <input type="number" disabled class="sCorp-earning23" />
                        <label>K1 Lines 1,2,3</label>
                        <input type="number" disabled class="sCorp-K1Lines23" />
                        <label>Cash Flow Adjustment </label>
                        <input type="number" disabled class="sCorp-CashFlowAdjustment23" />
                        <strong>Distributed K1 Income</strong>
                        <label>W2 Income</label>
                        <input type="number" disabled class="sCorp-DistributedW2Income23" />
                        <label>Distributions less Contributions</label>
                        <input type="number" disabled class="sCorp-DistributionslessContributions23" />
                        <label>K-1 Calculated Income</label>
                        <input type="number" disabled class="sCorp-K1CalculatedIncome23" />
                        <label>Monthly Income</label>
                        <input type="number" disabled class="sCorp-MonthlyIncome23" />
                        <label>Distributed K-1 Calculated Income</label>
                        <input type="number" disabled class="sCorp-DistributedK1CalculatedIncome23" />
                        <label>Monthly Income</label>
                        <input type="number" disabled class="sCorp-DistributedMonthlyIncome23" />

                        <strong>2022</strong>
                        <strong>K1 Income</strong>
                        <label>W2 Income</label>
                        <input type="number" disabled class="sCorp-earning22" />
                        <label>K1 Lines 1,2,3</label>
                        <input type="number" disabled class="sCorp-K1Lines22" />
                        <label>Cash Flow Adjustment </label>
                        <input type="number" disabled class="sCorp-CashFlowAdjustment22" />
                        <strong>Distributed K1 Income</strong>
                        <label>W2 Income</label>
                        <input type="number" disabled class="sCorp-DistributedW2Income22" />
                        <label>Distributions less Contributions</label>
                        <input type="number" disabled class="sCorp-DistributionslessContributions22" />
                        <label>K-1 Calculated Income</label>
                        <input type="number" disabled class="sCorp-K1CalculatedIncome22" />
                        <label>Monthly Income</label>
                        <input type="number" disabled class="sCorp-MonthlyIncome22" />
                        <label>Distributed K-1 Calculated Income</label>
                        <input type="number" disabled class="sCorp-DistributedK1CalculatedIncome22" />
                        <label>Monthly Income</label>
                        <input type="number" disabled class="sCorp-DistributedMonthlyIncome22" />
                    </div>
                </form>
            </div>
            <div id="Partnership1065" style="display: none">
                <h1>Partnership - 1065</h1>
                <form>
                    <table>
                        <thead>
                            <tr>
                                <th>Labels</th>
                                <th>2023</th>
                                <th>2022</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Form W-2 -->
                            <tr>
                                <td colspan="3">
                                    <h3>Form W-2</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>Wages: W-2, Box 5</td>
                                <td>
                                    <input type="number" class="input-field" name="wages_2023" value="45000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="wages_2022" value="45000" />
                                </td>
                            </tr>

                            <!-- Individual Income -->
                            <tr>
                                <td colspan="3">
                                    <h3>Individual Income</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>Ordinary Business Income or Loss - K1 Line 1</td>
                                <td>
                                    <input type="number" class="input-field" name="ordinary_income_2023" value="1" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="ordinary_income_2022" value="1" />
                                </td>
                            </tr>
                            <tr>
                                <td>Net Rental Income or Loss - K1 Line 2</td>
                                <td>
                                    <input type="number" class="input-field" name="rental_income_2023" value="1" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="rental_income_2022" value="1" />
                                </td>
                            </tr>
                            <tr>
                                <td>Other Rental Income or Loss - K1 Line 3</td>
                                <td>
                                    <input type="number" class="input-field" name="other_rental_income_2023" value="1" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="other_rental_income_2022" value="1" />
                                </td>
                            </tr>
                            <tr>
                                <td>Guaranteed Payments - K-1 Line 4 or 4c on 2019+</td>
                                <td>
                                    <input type="number" class="input-field" name="guaranteed_payments_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="guaranteed_payments_2022" value="5000" />
                                </td>
                            </tr>
                            <tr>
                                <td>Distributions - K1 Line 16D</td>
                                <td>
                                    <input type="number" class="input-field" name="distributions_2023" value="1" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="distributions_2022" value="1" />
                                </td>
                            </tr>
                            <tr>
                                <td>Contributions</td>
                                <td>
                                    <input type="number" class="input-field" name="contributions_2023" value="5" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="contributions_2022" value="5" />
                                </td>
                            </tr>

                            <!-- Business Income -->
                            <tr>
                                <td colspan="3">
                                    <h3>Business Income</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>Ordinary Income or Loss (1065 Line 4)</td>
                                <td>
                                    <input type="number" class="input-field" name="ordinary_income_1065_2023" value="10" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="ordinary_income_1065_2022" value="10" />
                                </td>
                            </tr>
                            <tr>
                                <td>Net Farm Profit (1065 Line 5)</td>
                                <td>
                                    <input type="number" class="input-field" name="net_farm_profit_2023" value="10" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="net_farm_profit_2022" value="10" />
                                </td>
                            </tr>
                            <tr>
                                <td>Net Gain Form 4797 (1065 Line 6)</td>
                                <td>
                                    <input type="number" class="input-field" name="net_gain_form_4797_2023" value="10" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="net_gain_form_4797_2022" value="10" />
                                </td>
                            </tr>
                            <tr>
                                <td>Other Income or Loss (1065 Line 7)</td>
                                <td>
                                    <input type="number" class="input-field" name="other_income_1065_2023" value="10" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="other_income_1065_2022" value="10" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depreciation (1065 Line 16c &amp; 8825 Line 14)</td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_1065_2023" value="10" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depreciation_1065_2022" value="10" />
                                </td>
                            </tr>
                            <tr>
                                <td>Depletion (1065 Line 17)</td>
                                <td>
                                    <input type="number" class="input-field" name="depletion_1065_2023" value="10" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="depletion_1065_2022" value="10" />
                                </td>
                            </tr>
                            <tr>
                                <td>Amortization/Casualty Loss (1065 Line 20)</td>
                                <td>
                                    <input type="number" class="input-field" name="amortization_loss_2023" value="10" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="amortization_loss_2022" value="10" />
                                </td>
                            </tr>
                            <tr>
                                <td>Mortgages, Notes, Bonds payable in less than 1 year (Sch-L Line 16d)</td>
                                <td>
                                    <input type="number" class="input-field" name="mortgages_notes_bonds_2023" value="-10" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="mortgages_notes_bonds_2022" value="-10" />
                                </td>
                            </tr>
                            <tr>
                                <td>Travel & Entertainment (Sch-M1 Line 4b)</td>
                                <td>
                                    <input type="number" class="input-field" name="travel_entertainment_2023" value="-10" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="travel_entertainment_2022" value="-10" />
                                </td>
                            </tr>

                            <!-- Other Information -->
                            <tr>
                                <td colspan="3">
                                    <h3>Other Information</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>Months in Service</td>
                                <td>
                                    <input type="number" class="input-field" name="months_in_service_2023" value="12" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="months_in_service_2022" value="12" />
                                </td>
                            </tr>
                            <tr>
                                <td>Percent Ownership</td>
                                <td>
                                    <input type="number" class="input-field" name="percent_ownership_2023" value="100" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="percent_ownership_2022" value="100" />
                                </td>
                            </tr>

                            <!-- K-1 Income -->
                            <tr>
                                <td colspan="3">
                                    <h3>K-1 Income</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>W-2 Income</td>
                                <td>
                                    <input type="number" class="input-field" name="w2_income_2023" value="45000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="w2_income_2022" value="45000" />
                                </td>
                            </tr>
                            <tr>
                                <td>K-1 Lines 1,2,3</td>
                                <td>
                                    <input type="number" class="input-field" name="k1_lines_123_2023" value="3" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="k1_lines_123_2022" value="3" />
                                </td>
                            </tr>
                            <tr>
                                <td>Cash Flow Adjustments</td>
                                <td>
                                    <input type="number" class="input-field" name="cash_flow_adjustments_2023" value="50" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="cash_flow_adjustments_2022" value="50" />
                                </td>
                            </tr>
                            <tr>
                                <td>Guaranteed Payments</td>
                                <td>
                                    <input type="number" class="input-field" name="guaranteed_payments_k1_2023" value="5000" />
                                </td>
                                <td>
                                    <input type="number" class="input-field" name="guaranteed_payments_k1_2022" value="5000" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <a href="javascript:void(0)" class="selfEmp-Sub-Btn" onclick="calculateTotalEarningsPartnership()">
                        Submit
                    </a>
                    <div class="partnershipResult" style="display: none">
                        <strong>2023</strong>
                        <strong>Distributed K-1 Income</strong>
                        <label>W-2 Income</label>
                        <input type="number" disabled class="partnership-earning23" />
                        <label>Distributions less Contributions</label>
                        <input type="number" disabled class="partnership-DistributionsLessContributions23" />
                        <label>Guaranteed Payments</label>
                        <input type="number" disabled class="partnership-GuaranteedPayments23" />
                        <label>K-1 Calculated Income</label>
                        <input type="number" disabled class="partnership-K1CalculatedIncome23" />
                        <label>Monthly Income</label>
                        <input type="number" disabled class="partnership-MonthlyIncome23" />
                        <label>Distributed K-1 Calculated Income</label>
                        <input type="number" disabled class="partnership-DistributedK1CalculatedIncome23" />
                        <label>Monthly Income</label>
                        <input type="number" disabled class="partnership-DistributedMonthlyIncome23" />

                        <strong>2022</strong>
                        <strong>Distributed K-1 Income</strong>
                        <label>W-2 Income</label>
                        <input type="number" disabled class="partnership-earning22" />
                        <label>Distributions less Contributions</label>
                        <input type="number" disabled class="partnership-DistributionsLessContributions22" />
                        <label>Guaranteed Payments</label>
                        <input type="number" disabled class="partnership-GuaranteedPayments22" />
                        <label>K-1 Calculated Income</label>
                        <input type="number" disabled class="partnership-K1CalculatedIncome22" />
                        <label>Monthly Income</label>
                        <input type="number" disabled class="partnership-MonthlyIncome22" />
                        <label>Distributed K-1 Calculated Income</label>
                        <input type="number" disabled class="partnership-DistributedK1CalculatedIncome22" />
                        <label>Monthly Income</label>
                        <input type="number" disabled class="partnership-DistributedMonthlyIncome22" />
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- summary section .....  -->
    <section>
        <h2>Summary section</h2>
        <p id="summary-section-intro"></p>
        <p id="summary-section-employments"></p>
        <p id="summary-section-duration"></p>
        <p id="summary-section-gap"></p>
        <p id="income-analysis-section"></p>
    </section>

    <!-- <section>
        <p class="q-text">Upload loan application and all supporting documents for income.</p>
        <strong class="strongSubHeading">Supporting documents for income</strong>
        <label class="custom-file-upload">
            <input type="file" />
            <span> <i class="fa-solid fa-upload"></i> Upload W2s</span>
        </label>
        <label class="custom-file-upload">
            <input type="file" />
            <span> <i class="fa-solid fa-upload"></i> Upload Paystubs</span>
        </label>
        <label class="custom-file-upload">
            <input type="file" />
            <span> <i class="fa-solid fa-upload"></i> Upload Tax Returns</span>
        </label>
        <label class="custom-file-upload">
            <input type="file" />
            <span> <i class="fa-solid fa-upload"></i> Upload VOE</span>
        </label>
        <label class="custom-file-upload">
            <input type="file" />
            <span> <i class="fa-solid fa-upload"></i> Upload Year-end Paystubs</span>
        </label>
    </section> -->

    <section>
        <p>General condtitions</p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
        </p>
    </section>

    <div style="text-align: center">
        <div class="button" id="prev">
            &larr; Previous
        </div>
        <div class="button" id="next">
            Next &rarr;
        </div>
        <div class="button" id="submit">
            Agree and send application
        </div>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <script src="script.js"></script>

    <script>

        const employmentSummary = {
            borrowerName: "",
            gaps: [],
            durations: [],
            employers: [],
            positions: [],
            incomeType: {
                salary: {
                    totalMonths: 0,
                    ytdGrossBasePay: 0,
                    currentGrossBasePay: 0,
                    endDateOfLastPaystub: new Date(),
                },
                hourly: {
                    totalMonths: 0,
                    ytdGrossBasePay: 0,
                    currentGrossBasePay: 0,
                    endDateOfLastPaystub: new Date(),
                },
                variable: {
                    /**
                     * @default default stable.
                     * @param Statuses are stable, unstable, normalized.
                     */
                    status: "stable",
                },
                selfEmployed: {}
            }
        }



        const incomeAnalysisTypes = {
            base: (args) => {
                return `Base pay was calculated by using the latest paystub as of [${moment(args.endDateOfLastPaystub).format("LL")}], taking the YTD income of [${args.currentGrossBasePay}] and dividing it by the number of months YTD which was [${args.totalMonths}]. This gave us a base pay of [].`;
            },

            stable: (args) => {
                return `Variable pay was calculated by using YTD + 2023 and 2022. This income was considered stable as the variable income was consistent and did not have more than a 10% decrease from year to year. We were also able to provide evidence for 2 + years. We took the average of YTD, 2023, and 2022. This gave us variable pay of [monthly variable income]`;
            },

            unstable: (args) => {
                return `Variable pay was calculated by using YTD + 2023 and 2022. This income was considered unstable
as the variable income was inconsistent and had more than a 10% decrease from YTD to 2023.
We were also able to provide evidence for 2 + years. The income was calculated by taking the
lower of YTD, 2023, and 2022. Please make sure to have your underwriter give this the green light
as its considered underwriter discretion, remembering the 4 Cs. This gave us variable pay of
[monthly variable income].`
            },

            normalized: (args) => {
                return `Variable pay was calculated by using YTD + 2023 and 2022. This income was considered
normalized as the variable income was inconsistent and had more than a 10% decrease from
2022 to 2023. However, YTD has recovered and is more in-line with 2022. We were also able to
provide evidence for 2 + years. The income was calculated by taking the lower of YTD, 2023, and
2022. Please make sure to have your underwriter give this the green light as its considered
en discretion, remembering the 4 Cs. This gave us variable pay of [monthly variable
income.`;
            }
        }




        const summarySectionIntro = document.getElementById("summary-section-intro");
        const summarySectionEmployments = document.getElementById("summary-section-employments");
        const summarySectionDuration = document.getElementById("summary-section-duration");
        const summarySectionGaps = document.getElementById("summary-section-gap");
        const incomeAnalysisSection = document.getElementById("income-analysis-section");

        // let e = new Set();
        let duration = 0;
        let totalMonths = 0;
        let totalGap = 0;

        let {
            borrowerName,
            employers,
            positions,
            durations,
            gaps,
            incomeType
        } = employmentSummary;


        const calculateTotalMonths = (start, end) => {
            let startDate = moment(start);
            let endDate = moment(end);

            return Math.round(endDate.diff(startDate, "months", true));
        }

        let s = new Set();
        const calculateGaps = (start, end, isCurrentJob) => {
            let startDate = moment(start);
            let endDate = moment(end);
            let gapInfo = null;
            let gap = 0;
            let isInvalid = false;

            s.add(JSON.stringify({ startDate, endDate, isCurrentJob }));

            let dates = [...s].map(e => JSON.parse(e)).sort((a, b) => moment(a.startDate).diff(b.startDate));
            console.log("LENGTH", dates.length);
            for (let i = 0; i < dates.length - 1; i++) {
                console.log("loop index", i);

                console.log((dates[i].endDate > dates[i + 1].startDate) && dates[i].isCurrentJob);
                if ((dates[i].endDate > dates[i + 1].startDate) && dates[i].isCurrentJob) {
                    console.log("INVALID");
                    isInvalid = true;
                }

                if (dates[i].endDate > dates[i + 1].startDate && !dates[i].isCurrentJob) {
                    isInvalid = false;
                    console.log("LESSER 2", moment(dates[i + 1].startDate).diff(moment(dates[i].endDate), "months"));
                    gap = Math.abs(Math.round(moment(dates[i + 1].startDate).diff(moment(dates[i].endDate), "months")));
                }

                if (dates[i].endDate < dates[i + 1].startDate) {
                    isInvalid = false;
                    console.log("LESSER 1", moment(dates[i].endDate).diff(moment(dates[i + 1].startDate), "months"));
                    gap = Math.abs(Math.round(moment(dates[i].endDate).diff(moment(dates[i + 1].startDate), "months")));
                }


                console.log("Sorted", dates);

                if (!isInvalid) {
                    if (gap > 0) {
                        let a;
                        let b;
                        console.log("ISINVALID ?? ", isInvalid);
                        if (dates[i].endDate < dates[i + 1].startDate) {
                            console.log("LESSER GAP 1");
                            a = dates[i + 1].startDate;
                            b = dates[i].endDate;
                        } else {
                            console.log("LESSER GAP 2");
                            a = dates[i].startDate;
                            b = dates[i + 1].endDate;
                        }

                        console.log("GAP START", a);
                        console.log("GAP END", b);
                        console.log("MOMENT", gap);

                        const startOfTheMonth = moment(b).add(1, 'day').format("l");
                        const endOfTheMonth = moment(a).subtract(1, 'day').format("l");

                        console.log("GAP START OF MONTH", startOfTheMonth);
                        console.log("GAP END OF MONTH", endOfTheMonth);
                        gapInfo = {
                            gap,
                            startOfTheMonth,
                            endOfTheMonth
                        }
                    }
                }
            }
            return gapInfo;
        }

        // function calculateMonths(start, end, { withGap = false, isCurrentJob = false } = {}) {
        //     let startDate = moment(start);
        //     let endDate = moment(end);
        //     let gapInfo = {};
        //     let gap = 0;

        //     s.add(JSON.stringify({ startDate, endDate, isCurrentJob }));

        //     // console.log("Unsorted", [...s]);
        //     // console.log("Sorted", [...s].map(e => JSON.parse(e)).sort((a, b) => moment(a.startDate).diff(b.startDate)));

        //     duration = Math.round(endDate.diff(startDate, "months", true));

        //     if (withGap) {

        //         let dates = [...s].map(e => JSON.parse(e)).sort((a, b) => moment(a.startDate).diff(b.startDate));
        //         console.log("LENGTH", dates.length);
        //         for (let i = 0; i < dates.length - 1; i++) {
        //             console.log("loop index", i);

        //             console.log((dates[i].endDate > dates[i + 1].startDate) && dates[i].isCurrentJob);
        //             if ((dates[i].endDate > dates[i + 1].startDate) && dates[i].isCurrentJob) {
        //                 console.log("INVALID");
        //                 return;
        //             }

        //             if (dates[i].endDate < dates[i + 1].startDate) {
        //                 console.log("LESSER 1", moment(dates[i].endDate).diff(moment(dates[i + 1].startDate), "months"));
        //                 gap = Math.abs(Math.round(moment(dates[i].endDate).diff(moment(dates[i + 1].startDate), "months")));
        //             } else {
        //                 console.log("LESSER 2", moment(dates[i + 1].startDate).diff(moment(dates[i].endDate), "months"));
        //                 gap = Math.abs(Math.round(moment(dates[i + 1].startDate).diff(moment(dates[i].endDate), "months")));
        //             }
        //             console.log("Sorted", dates);

        //             if (gap > 0) {
        //                 let a;
        //                 let b;

        //                 if (dates[i].endDate < dates[i + 1].startDate) {
        //                     console.log("LESSER GAP 1");
        //                     a = dates[i + 1].startDate;
        //                     b = dates[i].endDate;
        //                 } else {
        //                     console.log("LESSER GAP 2");
        //                     a = dates[i].startDate;
        //                     b = dates[i + 1].endDate;
        //                 }

        //                 console.log("GAP START", a);
        //                 console.log("GAP END", b);
        //                 console.log("MOMENT", gap);

        //                 const startOfTheMonth = moment(b).add(1, 'day').format("l");
        //                 const endOfTheMonth = moment(a).subtract(1, 'day').format("l");

        //                 console.log("GAP START OF MONTH", startOfTheMonth);
        //                 console.log("GAP END OF MONTH", endOfTheMonth);
        //                 gapInfo = {
        //                     gap,
        //                     startOfTheMonth,
        //                     endOfTheMonth,
        //                 }
        //             }

        //         }




        //         // for (let i = (dates.length - 1 && dates.length > 1); i >= 0; i--) {
        //         //     // let endDate = [...e].map(e => JSON.parse(e));
        //         //     console.log("loop index", i);
        //         //     gap = Math.abs(Math.round(moment(dates[i].endDate).diff(moment(dates[i - 1].startDate), "months")));
        //         //     console.log("Sorted", dates);
        //         //     console.log("INDEX FOR START", i - 1);
        //         //     console.log("INDEX FOR END", i);

        //         //     console.log("GAP START", dates[i - 1].startDate);
        //         //     console.log("GAP END", dates[i].endDate);
        //         //     console.log("MOMENT", moment(dates[i].endDate).diff(moment(dates[i - 1].startDate), "months"));

        //         //     console.log(gap);
        //         //     if (gap > 0) {
        //         //         const a = dates[i - 1].startDate;
        //         //         const b = dates[i].endDate;
        //         //         const startOfTheMonth = moment(b).add(1, 'day').format("l");
        //         //         const endOfTheMonth = moment(a).subtract(1, 'day').format("l");
        //         //         gapInfo = {
        //         //             gap,
        //         //             startOfTheMonth,
        //         //             endOfTheMonth,
        //         //         }
        //         //     }

        //         // }
        //     }
        //     return { duration, gapInfo };
        // }



        $(document).ready(function () {
            var base_color = "rgb(230,230,230)";
            var active_color = "#1ab188";

            var child = 1;
            var length = $("section").length - 1;
            $("#prev").addClass("disabled");
            $("#submit").addClass("disabled");

            $("section").not("section:nth-of-type(1)").hide();
            $("section").not("section:nth-of-type(1)").css("transform", "translateX(100px)");

            var svgWidth = length * 200 + 24;
            $("#svg_wrap").html(
                '<svg version="1.1" id="svg_form_time" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ' +
                svgWidth +
                ' 24" xml:space="preserve"></svg>'
            );

            function makeSVG(tag, attrs) {
                var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
                for (var k in attrs) el.setAttribute(k, attrs[k]);
                return el;
            }

            for (i = 0; i < length; i++) {
                var positionX = 12 + i * 200;
                var rect = makeSVG("rect", { x: positionX, y: 9, width: 200, height: 6 });
                document.getElementById("svg_form_time").appendChild(rect);
                // <g><rect x="12" y="9" width="200" height="6"></rect></g>'
                var circle = makeSVG("circle", {
                    cx: positionX,
                    cy: 12,
                    r: 12,
                    width: positionX,
                    height: 6,
                });
                document.getElementById("svg_form_time").appendChild(circle);
            }

            var circle = makeSVG("circle", {
                cx: positionX + 200,
                cy: 12,
                r: 12,
                width: positionX,
                height: 6,
            });
            document.getElementById("svg_form_time").appendChild(circle);

            $("#svg_form_time rect").css("fill", base_color);
            $("#svg_form_time circle").css("fill", base_color);
            $("circle:nth-of-type(1)").css("fill", active_color);

            $(".button").click(function () {
                $("#svg_form_time rect").css("fill", active_color);
                $("#svg_form_time circle").css("fill", active_color);
                var id = $(this).attr("id");
                if (id == "next") {
                    $("#prev").removeClass("disabled");
                    if (child >= length) {
                        $(this).addClass("disabled");
                        $("#submit").removeClass("disabled");
                    }
                    if (child <= length) {
                        child++;
                    }



                    if (child === 2) {
                        const name = document.querySelector(".additionalBorrowerName")
                        const employmentBlocks = document.querySelectorAll(".additionalEmploymentBlock");
                        borrowerName = name.value.toString();

                        employmentBlocks.forEach((block, index) => {
                            console.log("CALLED");
                            const employerName = block.querySelector(".additionalEmployerName");
                            const position = block.querySelector(".additionalPosition");
                            const startDateInput = block.querySelector('.additionalStartDate').value;
                            const endDateInput = block.querySelector('.additionalEndDate').value;
                            const isCurrentJob = block.querySelector('.CurrenPositionCheck').checked;

                            const startDate = new Date(startDateInput);
                            const endDate = isCurrentJob ? new Date() : new Date(endDateInput);

                            const duration = calculateTotalMonths(startDate, endDate);
                            totalMonths += duration;
                            durations.push({ totalMonths, startDate, endDate, isCurrentJob });
                            // if (index > 0) {
                            const gapInfo = calculateGaps(startDate, endDate, isCurrentJob);

                            if (gapInfo !== null) {
                                const { gap, startOfTheMonth, endOfTheMonth } = gapInfo;
                                totalGap += gap;
                                gaps.push({ gap, startOfTheMonth, endOfTheMonth });
                                gaps = gaps.filter(e => e.startOfTheMonth !== undefined && e.endOfTheMonth !== undefined);
                                console.log("MAIN GAPS", gaps.length, "GAP VALUE", gap, "TOTAL GAP VALUE", totalGap);

                            }
                            // }
                            employers.push(employerName.value.toString());
                            positions.push(position.value.toString());
                        });
                    }

                    // if (child === 2) {
                    //     const name = document.querySelector(".additionalBorrowerName")
                    //     const employmentBlocks = document.querySelectorAll(".additionalEmploymentBlock");
                    //     borrowerName = name.value.toString();

                    //     employmentBlocks.forEach((block, index) => {
                    //         console.log("CALLED");
                    //         const employerName = block.querySelector(".additionalEmployerName");
                    //         const position = block.querySelector(".additionalPosition");
                    //         const startDateInput = block.querySelector('.additionalStartDate').value;
                    //         const endDateInput = block.querySelector('.additionalEndDate').value;
                    //         const isCurrentJob = block.querySelector('.CurrenPositionCheck').checked;

                    //         const startDate = new Date(startDateInput);
                    //         const endDate = isCurrentJob ? new Date() : new Date(endDateInput);

                    //         const { duration, gapInfo } = calculateMonths(startDate, endDate, { withGap: true, isCurrentJob: isCurrentJob });
                    //         totalMonths += duration;
                    //         durations.push({ totalMonths, startDate, endDate, isCurrentJob });

                    //         // if (index > 0) {
                    //         //     const { gapInfo } = calculateMonths(startDate, endDate, { withGap: true, isCurrentJob: isCurrentJob });
                    //         const { gap, startOfTheMonth, endOfTheMonth } = gapInfo;
                    //         totalGap += gap;

                    //         // if (totalGap > 0) {
                    //         gaps.push({ gap, startOfTheMonth, endOfTheMonth });
                    //         // }
                    //         console.log("MAIN GAPS", gaps.length, "GAP VALUE", gap, "TOTAL GAP VALUE", totalGap);
                    //         // }

                    //         gaps = gaps.filter(e => e.startOfTheMonth !== undefined && e.endOfTheMonth !== undefined);
                    //         employers.push(employerName.value.toString());
                    //         positions.push(position.value.toString());
                    //     });
                    // }

                    if (child === 4) {
                        summarySectionIntro.innerText = `${borrowerName}`;
                        console.log("Borrower ", borrowerName);
                        console.log("Employers ", employers);
                        console.log("Positions ", positions);
                        console.log("Durations ", durations);

                        // const sourceOfIncomeType = incomeType[defaultIncomeType];

                        // Object.keys(incomeType).forEach((type) => {
                        //     switch (type) {
                        //         case "hourly":
                        //         case "salary":
                        //             console.log(incomeAnalysisTypes.base(sourceOfIncomeType));
                        //             incomeAnalysisSection.innerText = incomeAnalysisTypes.base(sourceOfIncomeType);
                        //             break;

                        //         default:
                        //             break;
                        //     }
                        // });


                        employers.forEach((employer, i) => {
                            const jobStartDuration = moment(durations[i].startDate).format("LL");
                            const jobEndDuration = moment(durations[i].endDate).format("LL");
                            jobPosition = positions[i];
                            summarySectionEmployments.innerText += `
                                Employer: ${employer}
                                ${jobStartDuration} - ${durations[i].isCurrentJob ? "Present" : jobEndDuration}
                                Position:  ${jobPosition}
                                `;
                        });


                        gaps?.forEach((e, i) => {
                            summarySectionEmployments.innerText += `
                                    Unemployment Gap ${i + 1}:
                                    ${e.startOfTheMonth} - ${e.endOfTheMonth}
                                `;
                        });

                        summarySectionDuration.innerText = `Total Month(s): ${durations[durations.length - 1].totalMonths
                            }`;

                        summarySectionGaps.innerText = `Total Gap: ${gaps.length > 0 ? gaps[gaps.length - 1].gap : 0} month(s).`;
                    }
                } else if (id == "prev") {
                    clearAllData();

                    $("#next").removeClass("disabled");
                    $("#submit").addClass("disabled");
                    if (child <= 2) {
                        $(this).addClass("disabled");
                    }
                    if (child > 1) {
                        child--;
                    }
                }
                var circle_child = child + 1;
                $("#svg_form_time rect:nth-of-type(n + " + child + ")").css("fill", base_color);
                $("#svg_form_time circle:nth-of-type(n + " + circle_child + ")").css("fill", base_color);
                var currentSection = $("section:nth-of-type(" + child + ")");
                currentSection.fadeIn();
                currentSection.css("transform", "translateX(0)");
                currentSection.prevAll("section").css("transform", "translateX(-100px)");
                currentSection.nextAll("section").css("transform", "translateX(100px)");
                $("section").not(currentSection).hide();
            });
        });

        function clearAllData() {
            gap = 0;
            duration = 0;
            totalGap = 0;
            totalMonths = 0;
            employers = [];
            positions = [];
            gaps = [];
            durations = [];
            s.clear();
            e.clear();

            summarySectionIntro.innerText = "";
            summarySectionDuration.innerText = "";
            summarySectionEmployments.innerText = "";
            summarySectionGaps.innerText = "";
        }
    </script>
</body>

</html>
