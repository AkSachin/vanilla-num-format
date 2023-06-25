const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', updateInput);

//lastSavedNumber with format
let lastSavedNumber = '';

function updateInput(event) {
    const input = phoneInput.value;
    
    // Remove all non-digit characters from the input/last saved input
    const lastsavedDigits = lastSavedNumber.replace(/\D/g, '');
    const digits = input.replace(/\D/g, '').length > 10 ? lastsavedDigits : input.replace(/\D/g, '');

    // Format the phone number
    let formattedNumber = '';
    if (digits.length >= 4) {
        formattedNumber = '(' + digits.substring(0, 3) + ') ';
        if (digits.length >= 7) {
            formattedNumber += digits.substring(3, 6) + '-' + digits.charAt(6);
            if (digits.length > 7) {
                formattedNumber += digits.substring(7, 10);
            }
        } else {
            formattedNumber += digits.substring(3, digits.length);
        }
    } else {
        formattedNumber = digits;
    }

    // Save the current cursor position
    const caretPosition = phoneInput.selectionStart;

    // Update the input value with the formatted number
    phoneInput.value = formattedNumber;

    // Calculate the new cursor position after formatting
    let newCaretPosition = caretPosition + (formattedNumber.length - input.length);

    if (digits === lastsavedDigits){
        if (input.length < lastSavedNumber.length && caretPosition === 5 && event.inputType.includes("delete")){
            if (event.inputType === "deleteContentForward"){
                newCaretPosition = 5;
            }
            else {
                newCaretPosition = 4;
            }
        }
        else if (caretPosition === 4){
            newCaretPosition = 4;
        }
        else if (input.length < lastSavedNumber.length && event.inputType.includes("delete")){
            newCaretPosition -= 1;
        }
    }
    else if (lastsavedDigits.length === 4 && digits.length === 3){
        if (caretPosition >= 1 && caretPosition <= 4){
            newCaretPosition = caretPosition - 1;
        }
    }
    else if (lastsavedDigits.length === 3 && digits.length === 4) {
        if (caretPosition >= 1 && caretPosition <= 3) {
            newCaretPosition = caretPosition + 1;
        }
    }
    else if (lastsavedDigits.length === 7 && digits.length === 6) {
        if (caretPosition >= 1 && caretPosition <= 3) {
            newCaretPosition = caretPosition;
        }
        else if (caretPosition >= 6 && caretPosition <= 8) {
            newCaretPosition = caretPosition;
        }
        else if (lastSavedNumber.length - 1 > input.length) {
            newCaretPosition = caretPosition;
        }
    }
    else if (lastsavedDigits.length === 6 && digits.length === 7) {
        if (caretPosition >= 2 && caretPosition <= 4) {
            newCaretPosition = caretPosition;
        }
        else if (caretPosition >= 7 && caretPosition <= 9) {
            newCaretPosition = caretPosition;
        }
    }
    else if (lastsavedDigits.length >= 4 && digits.length > lastsavedDigits.length) {
        if (caretPosition === 1) {
            newCaretPosition = 2;
        }
        else if (caretPosition === 5) {
            newCaretPosition = 7;
        }
        else if (caretPosition === 6) {
            newCaretPosition = 7;
        }
        else if (lastsavedDigits.length >= 7 && digits.length > lastsavedDigits.length) {
            if (caretPosition === 10) {
                newCaretPosition = 11;
            }
        }
    }
    else if (lastSavedNumber.length - 1 > input.length){
        if (digits.length>=7){
            newCaretPosition = caretPosition;
        }
        else if (digits.length < 7 && lastSavedNumber.length >= 7 && digits.length >=4){
            if (caretPosition === 0){
                newCaretPosition = 1;
            }
            else if (caretPosition>=1 && caretPosition<=4){
                newCaretPosition = caretPosition;
            }
            else if (caretPosition >= 5 && caretPosition <= 6 && event.inputType === "insertText"){
                newCaretPosition = 7;
            }
            else if (event.inputType.includes("delete")){
                newCaretPosition = caretPosition;
                if (caretPosition == 5){
                    newCaretPosition = 6;
                }
            }
        }
        else if (digits.length < 4 && event.inputType.includes("delete")){
            if (input.includes("(") && caretPosition === 1){
                newCaretPosition = 0;
            }
            else if (!input.includes("(")){
                newCaretPosition = 0;
            }
            else if (input.includes("(") && caretPosition === 2){
                newCaretPosition = 1;
            }
        }
        else if (digits.length < 4 && event.inputType.includes("insert")){
            if (caretPosition === 1){
                newCaretPosition = 1;
            }
            else if (caretPosition === 3){
                newCaretPosition = 2;
            }
        }

    }
    phoneInput.setSelectionRange(newCaretPosition, newCaretPosition);
    lastSavedNumber = formattedNumber;
}