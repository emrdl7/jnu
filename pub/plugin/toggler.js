'use strict';
(function ($) {

    $.fn.toggler = function (options) {
        if ($.type(_) != 'function') throw 'require underscore';

        return this.each(function () {
            var self = this, $this = $(this), $parent = $($this.parent()), data = $this.data();
            if (!_.has(data, 'targetClass')) throw 'need data-target-class (tag: ' + this.tagName + ', name: ' + $this.attr('name') + ')';
            var type = '';
            var events = {
                radio: 'click',
                select: 'change',
                input: 'keypress keyup'
            };

            if (self.tagName.toLowerCase() == 'input' && $this.attr('type').toLowerCase() == 'radio') {
                type = 'radio';
            } else if (self.tagName.toLowerCase() == 'input' && $this.attr('type').toLowerCase() == 'checkbox') {
                type = 'radio';
            } else if (self.tagName.toLowerCase() == 'select') {
                type = 'select';
            } else {
                type = 'input';
            }

            function detect() {
                $('.' + data.targetClass).addClass('hide').prop('disabled', true).find('input,select,textarea').prop('disabled', true);
                if(type == 'radio') {
                    if($this.is(':checked')) {
                        $('.' + data.targetClass + '-' + $this.val()).removeClass('hide').prop('disabled', false).find('input,select,textarea').prop('disabled', false);
                    }
                } else {
                    $('.' + data.targetClass + '-' + $this.val()).removeClass('hide').prop('disabled', false).find('input,select,textarea').prop('disabled', false);
                }
                $this.trigger('toggle', [$('.' + data.targetClass + '-' + $this.val())]);
            }

            if ((type == 'radio' && $this.is(':checked')) || type != 'radio') {
                detect();
            }
    
            $this.on(events[type], detect);
        });
    };
}(jQuery));