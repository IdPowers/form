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
        url: signUpForm.data('url')
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

    $('.mdl-textfield__input').on('blur', function() {
        var notEmptyFields = $(".js-sign-up-form .mdl-textfield__input").filter(function(i, el) {
            console.log( $(el).attr('name') , $(this).attr('name') )
            return ($(el).val() != "") && ($(el).val() != "+_______") || ($(el).attr('name') === $(this).attr('name'));
        });
        signUpInfo.data = notEmptyFields.serialize();
        var names = [];
        notEmptyFields.each(function(i, el) {
            names.push(el.name);
        });
        $.ajax({
            url: signUpInfo.url,
            dataType: 'json',
            type: 'POST',
            data: signUpInfo.data,
            error: function(e) {
                /**
                 * @type {Array}.<string|Array>
                 */
                var error = e.responseJSON.errors;
                error.forEach(function(item) {
                    /**
                     * @type {jQuery|HTMLElement}
                     */
                    if ($.inArray(item.name, names) !== -1) {
                        var field = signUpForm.find('[name=' + item.name + ']');
                        var fieldWrap = field.parent();
                        var errorField = field.parents('.form__item').find('.js-error');
                        /**
                         * @type {String}
                         */
                        var fieldType = field.attr('type');

                        if (fieldType === 'checkbox' || fieldType === 'radio') {
                            errorField.addClass('is-visible');
                        } else {
                            fieldWrap.addClass('is-invalid');
                        }

                        errorField.text(item.errors[0]);
                    }
                })
            }
        })
    });

    /**
     * Sending the form and its validation.
     */
    signUpButton.on('click', function(e) {
        e.preventDefault(e);
        signUpInfo.data = signUpForm.find('.mdl-textfield__input').serialize();
        $.ajax({
            url: signUpInfo.url,
            dataType: 'json',
            type: 'POST',
            data: signUpInfo.data,
            success: function() {
                /**
                 * Show popup.
                 */
                showDialog({
                    title: 'Congratulations',
                    text: 'Thank you for submitting your request to join our Cell Phone Program. Please allow 2-3' +
                    ' business days for processing'
                });
                /**
                 * Cleaning form.
                 */
                //signUpForm.resetForm();
            },
            error: function(e) {
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

                    if (fieldType === 'checkbox' || fieldType === 'radio') {
                        errorField.addClass('is-visible');
                    } else {
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
        $(this).parents('.form__item').find('.js-error').removeClass('is-visible');
    });

    /**
     * Unlock the button when the user agrees with the user agreement.
     */
    $('.js-sign-up-agreement input').on('click', function() {
        var state = $(this).prop('checked');

        if (state) {
            signUpButton.prop('disabled', false)
        } else {
            signUpButton.prop('disabled', true)
        }
    })
});