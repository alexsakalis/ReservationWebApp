function php_email_form(thisForm, action, formData) {
  fetch(action, {
    method: 'POST',
    body: formData,
    headers: {'X-Requested-With': 'XMLHttpRequest'}
  })
  .then(response => {
    if(response.ok) {
      return response.text();
    } else {
      throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
    }
  })
  .then(data => {
    thisForm.querySelector('.loading').classList.remove('d-block');
    if (data.trim() == 'OK' || data.includes('Reservation submitted successfully')) {
      thisForm.querySelector('.sent-message').classList.add('d-block');
      thisForm.reset();
    } else {
      throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
    }
  })
  .catch((error) => {
    displayError(thisForm, error);
  });
            document.getElementById("submit-reservation").addEventListener("submit", function(event) {
                event.preventDefault();
                if ("Notification" in window) {
                    if (Notification.permission === "granted") {
                        new Notification("Table Reserved", {
                            body: "Your table has been successfully reserved!",
                        });
                    } else if (Notification.permission !== "denied") {
                        Notification.requestPermission().then(function (permission) {
                            if (permission === "granted") {
                                new Notification("Table Reserved", {
                                    body: "Your table has been successfully reserved!",
                                });
                            }
                        });
                    }
                }
            });
}
