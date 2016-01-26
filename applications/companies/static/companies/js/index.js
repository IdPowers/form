$(function () {
    /**
     * @type {string}
     */
    var token = $.cookie('csrftoken');

    if (token) {
        $.ajaxSetup({
            headers: {
                'X-CSRFToken': token
            }
        });
    }

    /**
     * Registration Form.
     * @type {jQuery|HTMLElement}
     */
    var signUpForm = $('.js-sign-up-form');

    /**
     * @type {Object}.<string>
     */
    var signUpInfo = {
        url: signUpForm.data('url'),
        data: signUpForm.serialize()
    };

    /**
     * @type {jQuery|HTMLElement}
     */
    var signUpButton = $('.js-sign-up-button');

    /**
     * Mask phone number.
     */
    $('.js-phone').inputmask({
        mask:'+9999999[9][9][9][9][9][9][9][9][9][9][9][9][9]',
        greedy: false,
        showMaskOnHover: false
    });

    $(document).ajaxStart(function() {
        showLoading();
    });
    /**
     * Sending the form and its validation.
     */
    signUpButton.on('click', function(e) {
        e.preventDefault(e);
        signUpForm.ajaxSubmit({
            url: signUpInfo.url,
            success: function() {
                /**
                 * Cleaning form.
                 */
                signUpForm.resetForm();
                signUpForm.find('.is-dirty').removeClass('is-dirty');
                signUpForm.find('.is-checked').removeClass('is-checked');

                $('.input-file [data-type="name"]').text('');
                hideLoading();
                /**
                 * Show popup.
                 */
                showDialog({
                    title: 'Congratulations',
                    text: 'Thank you for submitting your request to join our Cell Phone Program. Please allow 2-3' +
                    ' business days for processing'
                });
            },
            error: function(e) {
                hideLoading();
                /**
                 * @type {Array}.<string|Array>
                 */
                var error = e.responseJSON.errors;
                error.forEach(function(item) {
                    /**
                     * @type {jQuery|HTMLElement}
                     */
                    var field = signUpForm.find('[name=' + item.name + ']');
                    var fieldWrap = field.parent();
                    var errorField = field.parents('.form__item').find('.js-error');
                    /**
                     * @type {String}
                     */
                    var fieldType = field.attr('type');

                    if (fieldType !== 'checkbox' || fieldType !== 'radio') {
                        fieldWrap.addClass('is-invalid');
                    }

                    errorField.text(item.errors[0]);
                })
            }
        })
    });

    /**
     * Hide error when entering text.
     */
    $('.mdl-textfield__input').on('keydown', function() {
        $(this).parent().removeClass('is-invalid');
    });

    /**
     * Hide error when clicking on the item.
     */
    $('.mdl-checkbox__input, .mdl-radio__button').on('click', function() {
        $(this).parents('.form__item').find('.js-error').text('');
    });

    /**
     * Unlock the button when the user agrees with the user agreement.
     */
    $('.js-sign-up-agreement input').on('click', function() {

        if ($('.js-sign-up-agreement input:checked').length == 2) {
            signUpButton.prop('disabled', false)
        } else {
            signUpButton.prop('disabled', true)
        }
    });

    var inputFileList = document.querySelectorAll('.js-input-file');
    Array.prototype.forEach.call(inputFileList, function(el) {
        new InputFile(el, {})
    })
});