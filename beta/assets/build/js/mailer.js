;(function($) {
    $(function() {
        initMailer();
    });

    function initMailer() {
        if (!$.fn.validator) {
            return;
        }

        $('.js-ContactForm').validator().on('submit', function(e) {
            var $form     = $(this),
                $btn      = $form.find('[type="submit"]'),
                $response = $('<div />', {
                    'class': 'alert u-MarginTop20 js-Response',
                    'style': 'display:none'
                    });

            if (!$form.data('isready')) {
                $btn.after($response);
                $form.data('isready', true);
            }

            
        });
    }
}(jQuery))
