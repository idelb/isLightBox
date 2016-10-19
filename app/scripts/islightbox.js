(function($) {
    $.fn.isLightBox = function(config) {
        var defaults = {
            revealSpeed: 400,
            background: 'rgba(0,0,0,.8)',
            overlayClose: true,
            escKey: true,
            /*
            navKey: true,
            closeTip: 'tip-l-fade',
            closeTipText: 'Close',
            prevTip: 'tip-t-fade',
            prevTipText: 'Previous',
            nextTip: 'tip-t-fade',
            nextTipText: 'Next',
            callbackInit: function() {},
            callbackBeforeOpen: function() {},
            callbackAfterOpen: function() {},
            callbackBeforeClose: function() {},
            callbackAfterClose: function() {},
            callbackError: function() {},
            callbackPrev: function() {},
            callbackNext: function() {},
            callbackAfterShow: function() {},
            errorMessage: 'Error loading content.'*/
        };

        var options = $.extend({}, defaults, config);

        $.isLightBox.init($(this), options);
    };

    $.extend({
        isLightBox: {
            init: function($obj, options) {
                var $isLightBox = this;

                $obj.on('click', function(e) {
                    e.preventDefault();

                    var elementPath = $(this).attr('href');

                    $isLightBox.createIsLightBox(elementPath, options);
                });
            },
            setStyles: function(options) {
                var $styles = '<style type="text/css" id="islb-styles">.islb {background-color: ' + options.background + '; transition: opacity ' + options.revealSpeed / 1000 + 's ease-in-out;} .islb.islb-active {transition: opacity ' + options.revealSpeed / 1000 + 's ease-in-out;}</style>';

                $('head').find('#islb-styles').remove();

                $('head').append($styles);
            },
            createIsLightBox: function(elementPath, options) {
                var $isLightBox = this;

                $isLightBox.setStyles(options);

                var $islb = $('<div>', {'class': 'islb'}),
                    $islbContainer = $('<div>', {'class': 'islb-container'}),
                    $islbMediaContainer = $('<div>', {'class': 'islb-media-container'}),
                    $islbMedia = $('<div>', {'class': 'islb-media'}),
                    $islbMediaElement = $('<div>', {'class': 'islb-media-element'});

                $islb.html(
                    $islbContainer.html(
                        $islbMediaContainer.html(
                            $islbMedia.html(
                                $islbMediaElement.html(
                                    this.getElement.init(elementPath)
                                )
                            )
                        )
                    )
                );

                $('body').append($islb);

                setTimeout(function() {
                    $islb.addClass('islb-active');
                }, 100);

                if (options.overlayClose) {
                    $islb.on('click', function(e) {
                        if($(e.target).closest('.islb-media-element').length == 0) {
                            $isLightBox.destroyIsLightBox(options);
                        }
                    });
                }

                if (options.escKey) {
                    $(document).on('keyup', function(e) {
                        if (e.keyCode == 27) {
                            $isLightBox.destroyIsLightBox(options);
                        }
                    });
                }
            },
            destroyIsLightBox: function(options) {
                $('.islb').removeClass('islb-active');

                $(document).off('keyup');

                setTimeout(function() {
                    $('.islb').remove();
                }, options.revealSpeed + 100);
            },
            getElement: {
                init: function(elementPath) {
                    return this.getImage(elementPath);
                },
                getImage: function(elementPath) {
                    return $('<img>', {'src': elementPath});
                }
            }
        }
    });
})(jQuery);

$(function() {
    $('[data-islightbox]').isLightBox();
});
