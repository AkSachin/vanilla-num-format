import { readFileSync } from 'fs';
import { resolve } from 'path';
import { beforeEach, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import userEvent from '@testing-library/user-event';

const window = new Window();

const document = window.document;
document.write(`<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
      <div class="container text-center">
          <input type="tel" id="phone" maxlength="14" placeholder="mobile number" autocomplete="off" minlength="14"/>
          <div><label for="phone">(123) 456-7890</label></div>
      </div>
  </body>
</html>`);
const scriptPath = resolve(__dirname, './index.js');
const scriptContent = readFileSync(scriptPath, 'utf-8');

// Create a script element and append it to the document
const script = document.createElement('script');
script.textContent = scriptContent;
document.body.appendChild(script);

beforeEach(()=>{
    document.getElementById('phone').value = '';
})

it('should format the number in correct format.', async () => {
    const input = document.getElementById('phone');
    await userEvent.type(input, '1234567890');
    expect(input.value).to.be.equal('(123) 456-7890');
});

it('should not format the number if provided value is 3 or less digits.', async () => {
    const input = document.getElementById('phone');
    await userEvent.type(input, '123');
    expect(input.value).to.be.equal('123');
});

it('should start formatting on 4th digit input.', async () => {
    const input = document.getElementById('phone');
    await userEvent.type(input, '1234');
    expect(input.value).to.be.equal('(123) 4');
});

it('should remove formatting on 4th digit removal.', async () => {
    const input = document.getElementById('phone');
    await userEvent.type(input, '1234');
    await userEvent.type(input, '{backspace}');
    expect(input.value).to.be.equal('123');
});

it('should start add hyphen on 7th digit input and not before that and remove on 7th digit removal.', async () => {
    const input = document.getElementById('phone');
    await userEvent.type(input, '123456');
    expect(input.value).to.not.contain('-');
    await userEvent.type(input, '7');
    expect(input.value).to.contain('-');
    expect(input.value).to.be.equal('(123) 456-7');
    await userEvent.type(input, '{backspace}');
    expect(input.value).to.be.equal('(123) 456');
});

it('should maintain formatting on if one digit is swapped by selecting a character and should maintain caret position', async () => {
    const input = document.getElementById('phone');
    await userEvent.type(input, '1234567890');
    await userEvent.type(input, '1', {
        initialSelectionStart: 2,
        initialSelectionEnd: 3,
    });
    expect(input.value).to.be.equal('(113) 456-7890');
    expect(input.selectionStart).to.be.equal(3);
});


it('should not accept any value after 10 digits', async () => {
    const input = document.getElementById('phone');
    await userEvent.type(input, '123456789012');
    expect(input.value).to.be.equal('(123) 456-7890');
});

it('should show the caret on right position after more than 1 characters removed by selection.', async () => {
    const input = document.getElementById('phone');
    await userEvent.type(input, '1234567890');
    expect(input.value).to.be.equal('(123) 456-7890');
    await userEvent.type(input, '{backspace}', {
        initialSelectionStart: 3,
        initialSelectionEnd: 12,
    });
    expect(input.value).to.be.equal('(129) 0');
    expect(input.selectionStart).to.be.equal(3);
    await userEvent.type(input, '{backspace}', {
        initialSelectionStart: 2,
        initialSelectionEnd: 4,
    });
    expect(input.selectionStart).to.be.equal(1);
});