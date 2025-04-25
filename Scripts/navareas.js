"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const inputTextField = document.querySelector(".input-plain-text");
    const filenameField = document.querySelector(".fielname-field");
    const fileDescription = document.querySelector(".file-description");
    const addLineButton = document.querySelector(".add-line");
    const addAreaButton = document.querySelector(".add-area");
    const addLabelsButton = document.querySelector(".add-labels");
    const addCircleButton = document.querySelector(".add-circle");
    const outputTextArea = document.querySelector(".text_output");
    const noticesAdded = document.querySelector(".notices-added_list");
    const clearInputBtn = document.querySelector(".clear-input-button");
    const link = document.querySelector(".download-link");

    let linesCumulative = "";
    let areasCumulative = "";
    let labelsCumulative = "";
    let circlesCumalative = "";
    let noticesList = "";

    // Snackbar
    const snackbar = document.querySelector(".snackbar");
    let hideTimer;
    snackbar.addEventListener("click", () => {
        snackbar.classList.add("hide-snackbar");
        clearInterval(hideTimer);
    });

    function callSnackbar(type, text) {
        snackbar.textContent = text;
        if (!snackbar.classList.contains("hide-snackbar")) {
            clearInterval(hideTimer);
        }
        if (type === "success") {
            snackbar.classList.remove("snackbar-warning");
            snackbar.classList.add("snackbar-success");
            snackbar.classList.remove("hide-snackbar");
        } else if (type === "error") {
            snackbar.classList.remove("snackbar-success");
            snackbar.classList.add("snackbar-warning");
            snackbar.classList.remove("hide-snackbar");
        }
        hideTimer = setTimeout(() => {
            snackbar.classList.add("hide-snackbar");
        }, 7000);
    }
    function checkFilenameAndFileDescription() {
        if (!filenameField.value.trim()) {
            handleInputFieldError("Type in filename before creating navareas", filenameField);
            return false;
        } else if (filenameField.value.trim().length > 50) {
            handleInputFieldError("Not more than 50 letters in filename", filenameField);
            return false;
        }
        clearInputError(filenameField);
        if (fileDescription.value.trim().length > 60) {
            handleInputFieldError("Not more than 60 letters in file description", fileDescription);
            return false;
        }
        clearInputError(fileDescription);
        return true;
    }
    function handleInputFieldError(text, element) {
        callSnackbar("error", `${text}`);
        element.classList.add("input-error");
        element.focus();
    }
    function clearInputError(inputElement) {
        if (inputElement.classList.contains("input-error")) {
            inputElement.classList.remove("input-error");
        }
    }
    function addNoticeToList(noticeNameField) {
        noticesList += noticeNameField.value.trim() + "; ";
        noticesAdded.textContent = noticesList;
    }
    function clearFields(
        dangerField,
        radarDisplayField,
        nameField,
        descriptionField,
        ...extraFields
    ) {
        dangerField.checked = true;
        radarDisplayField.checked = false;
        nameField.value = "";
        descriptionField.value = "";
        if (extraFields.length > 0) {
            extraFields.forEach((field) => (field.value = ""));
        }
    }
    // function showIndication(type, element) {
    //     switch (type) {
    //         case "success": {
    //             element.classList.add("indicate-success");
    //             setTimeout(() => {
    //                 element.classList.remove("indicate-success");
    //             }, 300);
    //             break;
    //         }
    //         case "error": {
    //             element.classList.add("indicate-error");
    //             setTimeout(() => {
    //                 element.classList.remove("indicate-error");
    //             }, 300);
    //             break;
    //         }
    //     }
    // }
    function createOutput() {
        outputTextArea.value = `<?xml version="1.0" encoding="UTF-8"?>
        <!--userchart node-->
        <userchart name='${filenameField.value.trim()}' description="${fileDescription.value.trim()}" version="1.0">
            ${
                linesCumulative
                    ? `<!--userchart line-->
                <lines>
                    ${linesCumulative}
                </lines>`
                    : ""
            }
            ${
                areasCumulative
                    ? `<!--userchart area-->
                <areas>
                    ${areasCumulative}
                </areas>`
                    : ""
            }
            ${
                labelsCumulative
                    ? `<!--userchart label-->
                <labels>
                    ${labelsCumulative}
                </labels>`
                    : ""
            }
            ${
                circlesCumalative
                    ? `<!--userchart circle-->
                <circles>
                    ${circlesCumalative}
                </circles>`
                    : ""
            }
        </userchart>`;
        const file = new File([outputTextArea.value], `${filenameField.value}.xml`, {
            type: "XML",
        });
        link.href = URL.createObjectURL(file);
        link.download = `${filenameField.value}.xml`;
        link.classList.remove("hide");
    }

    function getPositions() {
        let navareaText = inputTextField.value;
        let positions;
        positions =
            navareaText.match(/\d{2,3}-\d\d[.,]\d{1,2}[nwse]/gi) ||
            navareaText.match(/\d{2,3}-\d\d[nwse]/gi);
        if (!positions) {
            callSnackbar("error", "No positions found...");
            return;
        }
        if (positions.length % 2 !== 0) {
            callSnackbar("error", "Error in positions. Try to copy and paste again");
            return;
        }
        let transformedPositionsArray = positions.map((item) => {
            const [degrees, minutesWithDirection] = item.split("-");
            const direction = minutesWithDirection[minutesWithDirection.length - 1].toLowerCase();
            const minutes = +(Number.parseFloat(minutesWithDirection) / 60).toFixed(6);
            let degreesAndMinutes = +degrees + minutes;
            if (direction === "s" || direction === "w") {
                degreesAndMinutes *= -1;
            }
            return degreesAndMinutes;
        });
        let positionsPairs = [];
        for (let i = 0; i < transformedPositionsArray.length; i += 2) {
            positionsPairs = [
                ...positionsPairs,
                [transformedPositionsArray[i], transformedPositionsArray[i + 1]],
            ];
        }
        return positionsPairs;
    }
    // Input
    clearInputBtn.addEventListener("click", () => {
        inputTextField.value = "";
    });

    // Lines
    const selectLine = document.querySelector(".select-line");
    const lineExampleImage = document.querySelector(".line-example");
    selectLine.addEventListener("change", () => {
        const lineType = selectLine.value;
        switch (lineType) {
            case "1":
                lineExampleImage.src = "./assets/coast.PNG";
                break;
            case "2":
                lineExampleImage.src = "./assets/nav.PNG";
                break;
            case "3":
                lineExampleImage.src = "./assets/route.PNG";
                break;
            case "4":
                lineExampleImage.src = "./assets/depth.PNG";
                break;
        }
    });
    const lineDanger = document.querySelector(".line-danger");
    const lineRadarDisplay = document.querySelector(".line-radar-display");
    const lineName = document.querySelector(".line-name");
    const lineDescriptionText = document.querySelector(".line-description");
    const clearLineFieldsButton = document.querySelector(".clear-line");
    const lineContainer = document.querySelector(".lines");
    clearLineFieldsButton.addEventListener("click", () =>
        clearFields(lineDanger, lineRadarDisplay, lineName, lineDescriptionText)
    );
    addLineButton.addEventListener("click", () => {
        if (!checkFilenameAndFileDescription()) {
            return;
        }
        const lineType = selectLine.value;
        const ifDanger = lineDanger.checked ? 1 : 0;
        const ifRadarDisplay = lineRadarDisplay.checked ? 1 : 0;
        const linePositions = getPositions();
        if (!linePositions) {
            // showIndication("error", lineContainer);
            return;
        }
        if (linePositions.length <= 1) {
            // showIndication("error", lineContainer);
            callSnackbar(
                "error",
                "Not enough positions to plot a line. More than 1 position required."
            );
            return;
        }
        if (!lineName.value.trim()) {
            // showIndication("error", lineContainer);
            handleInputFieldError("Fill up Line Name field", lineName);
            return;
        }
        clearInputError(lineName);
        if (lineDescriptionText.value.trim().length > 60) {
            handleInputFieldError("Maximum 60 letters in description field", lineDescriptionText);
            // showIndication("error", lineContainer);
            return;
        }
        clearInputError(lineDescriptionText);
        let linesList = "";
        linePositions.forEach((position, number) => {
            const [lat, long] = position;
            linesList += `
            <vertex id="${number + 1}" latitude="${lat}" longitude="${long}"/>
            `;
        });
        let outputLine = `
        <line name="${lineName.value.trim()}" description="${lineDescriptionText.value.trim()}">
            <position>
                ${linesList}
            </position>
            <attribute lineType="${lineType}"/>
            <type checkDanger="${ifDanger}" displayRadar="${ifRadarDisplay}" hasNotes="0" rangeOfNotes="1.000000"/>
        </line>
        `;
        linesCumulative += outputLine;
        addNoticeToList(lineName);
        createOutput();
        // showIndication("success", lineContainer);
        callSnackbar("success", "Line successfully added to Navarea");
        clearFields(lineDanger, lineRadarDisplay, lineName, lineDescriptionText, inputTextField);
    });

    // Area
    const areaDanger = document.querySelector(".area-danger");
    const areaRadarDisplay = document.querySelector(".area-radar-display");
    const areaName = document.querySelector(".area-name");
    const areaDescriptionText = document.querySelector(".area-decription");
    const clearAreaFieldsButton = document.querySelector(".clear-area");
    const areaContainer = document.querySelector(".area");
    clearAreaFieldsButton.addEventListener("click", () => {
        clearFields(areaDanger, areaRadarDisplay, areaName, areaDescriptionText);
    });
    addAreaButton.addEventListener("click", () => {
        if (!checkFilenameAndFileDescription()) {
            return;
        }
        const ifDanger = areaDanger.checked ? 1 : 0;
        const ifRadar = areaRadarDisplay.checked ? 1 : 0;
        const areaPositions = getPositions();
        if (!areaPositions) {
            // showIndication("error", areaContainer);
            return;
        }
        if (areaPositions.length < 3) {
            // showIndication("error", areaContainer);
            callSnackbar("error", "Minimum 3 positions required to plot Area");
            return;
        }
        if (!areaName.value.trim()) {
            // showIndication("error", areaContainer);
            handleInputFieldError("Fill up Area Name field", areaName);
            return;
        }
        clearInputError(areaName);
        if (areaDescriptionText.value.trim().length >= 60) {
            // showIndication("error", areaContainer);
            handleInputFieldError("Maximum 60 letters in description field", areaDescriptionText);
            return;
        }
        clearInputError(areaDescriptionText);
        let areaPositionsList = "";
        areaPositions.forEach((position, number) => {
            const [lat, long] = position;
            areaPositionsList += `
            <vertex id="${number + 1}" latitude="${lat}" longitude="${long}"/>
            `;
        });
        let outputArea = `
        <area name="${areaName.value.trim()}" description="${areaDescriptionText.value.trim()}">
            <position>
                ${areaPositionsList}
            </position>
            <type checkDanger="${ifDanger}" displayRadar="${ifRadar}" hasNotes="0" notesType="0"/>
        </area>
        `;
        areasCumulative += outputArea;
        addNoticeToList(areaName);
        createOutput();
        // showIndication("success", areaContainer);
        callSnackbar("success", "Area successfully added to Navarea");
        clearFields(areaDanger, areaRadarDisplay, areaName, areaDescriptionText, inputTextField);
    });

    // Label
    const selectLabel = document.querySelector(".select-label");
    const labelDanger = document.querySelector(".labels-danger");
    const labelRadarDisplay = document.querySelector(".labels-radar-display");
    const labelName = document.querySelector(".label-name");
    const labelText = document.querySelector(".label-text");
    const labelDescription = document.querySelector(".label-decription");
    const clearLabelFieldsButton = document.querySelector(".clear-labels");
    const labelsContainer = document.querySelector(".labels");
    clearLabelFieldsButton.addEventListener("click", () => {
        clearFields(labelDanger, labelRadarDisplay, labelName, labelDescription, labelText);
    });
    addLabelsButton.addEventListener("click", () => {
        if (!checkFilenameAndFileDescription()) {
            return;
        }
        const ifDanger = labelDanger.checked ? 1 : 0;
        const ifRadar = labelRadarDisplay.checked ? 1 : 0;
        const labelsPositions = getPositions();
        if (!labelsPositions) {
            // showIndication("error", labelsContainer);
            return;
        }
        if (!labelName.value.trim()) {
            // showIndication("error", labelsContainer);
            handleInputFieldError("Fill up Label Name field", labelName);
            return;
        }
        clearInputError(labelName);
        if (labelDescription.value.trim().length >= 60) {
            // showIndication("error", labelsContainer);
            handleInputFieldError("Maximum 60 letters in description field", labelDescription);
            return;
        }
        clearInputError(labelDescription);
        let labelsList = "";
        labelsPositions.forEach((position) => {
            const [lat, long] = position;
            labelsList += `
            <label name="${labelName.value.trim()}" description="${labelDescription.value.trim()}">
                <position>
                    <vertex id="1" latitude="${lat}" longitude="${long}"/>
                </position>
                <attribute labelStyle="${selectLabel.value}" labelText="${labelText.value.trim()}"/>
                <type checkDanger="${ifDanger}" displayRadar="${ifRadar}"/>
            </label>
            `;
        });
        labelsCumulative += labelsList;
        addNoticeToList(labelName);
        createOutput();
        // showIndication("success", labelsContainer);
        const oneOrMany = labelsPositions.length > 1 ? "Labels" : "Label";
        callSnackbar("success", `${oneOrMany} successfully added to Navarea`);
        clearFields(
            labelDanger,
            labelRadarDisplay,
            labelName,
            labelDescription,
            labelText,
            inputTextField
        );
    });

    // Circle
    const circleDanger = document.querySelector(".circle-danger");
    const circleRadarDisplay = document.querySelector(".circle-radar-display");
    const circleRadius = document.querySelector(".circle-radius");
    const circleName = document.querySelector(".circle-name");
    const circleDescription = document.querySelector(".circle-decription");
    const clearCircleFieldsButton = document.querySelector(".clear-circle");
    const circlesContainer = document.querySelector(".circle");
    clearCircleFieldsButton.addEventListener("click", () => {
        clearFields(circleDanger, circleRadarDisplay, circleName, circleDescription, circleRadius);
    });
    addCircleButton.addEventListener("click", () => {
        if (!checkFilenameAndFileDescription()) {
            return;
        }
        const ifDanger = circleDanger.checked ? 1 : 0;
        const ifRadar = circleRadarDisplay.checked ? 1 : 0;
        const circlesPositions = getPositions();
        if (!circlesPositions) {
            // showIndication("error", circlesContainer);
            return;
        }
        if (!circleRadius.value) {
            // showIndication("error", circlesContainer);
            handleInputFieldError("Radius value required to plot a circle", circleRadius);
            return;
        }
        if (circleRadius.value <= 0 || circleRadius.value > 100) {
            // showIndication("error", circlesContainer);
            handleInputFieldError("Radius value must be between 0 and 100", circleRadius);
            return;
        }
        clearInputError(circleRadius);
        if (!circleName.value.trim()) {
            // showIndication("error", circlesContainer);
            handleInputFieldError("Fill up Circle Name field", circleName);
            return;
        }
        clearInputError(circleName);

        if (circleDescription.value.trim().length >= 60) {
            // showIndication("error", circlesContainer);
            handleInputFieldError("Maximum 60 letters in description field", circleDescription);
            return;
        }
        clearInputError(circleDescription);
        let circlesList = "";
        circlesPositions.forEach((position) => {
            const [lat, long] = position;
            circlesList += `
            <circle name="${circleName.value.trim()}" description="${circleDescription.value.trim()}">
                <position>
                    <vertex id="1" latitude="${lat}" longitude="${long}"/>
                </position>
                <attribute range="${circleRadius.value}"/>
                <type checkDanger="${ifDanger}" displayRadar="${ifRadar}" hasNotes="0" notesType="0"/>
            </circle>
            `;
        });
        circlesCumalative += circlesList;
        addNoticeToList(circleName);
        createOutput();
        // showIndication("success", circlesContainer);
        const oneOrMany = circlesPositions.length > 1 ? "Circles" : "Circle";
        callSnackbar("success", `${oneOrMany} successfully added to Navarea`);
        clearFields(
            circleDanger,
            circleRadarDisplay,
            circleName,
            circleDescription,
            circleRadius,
            inputTextField
        );
    });

    // Output
    const copyButton = document.querySelector(".copy-button");
    const clearOutputBtn = document.querySelector(".clear-output-button");
    clearOutputBtn.addEventListener("click", () => {
        outputTextArea.value = "";
        link.classList.add("hide");
        noticesAdded.textContent = "";
    });
    copyButton.addEventListener("click", () => {
        if (outputTextArea.value) {
            outputTextArea.select();
            navigator.clipboard.writeText(outputTextArea.value);
        }
    });
});
