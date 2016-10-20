(function($) {
    $.fn.isLightBox = function(config) {
        var defaults = {
            revealSpeed: 400,
            background: 'rgba(0,0,0,.8)',
            overlayClose: true,
            escKey: true,
            /*
            navKey: true,
            callbackError: function() {},
            callbackPrev: function() {},
            callbackNext: function() {},
            */
        };

        var options = $.extend({}, defaults, config);

        $.isLightBox.init($(this), options);
    };

    var plugin = {
        isLightBox: {
            init: function($obj, options) {
                var $isLightBox = this;

                $obj.on('click', function(e) {
                    e.preventDefault();

                    $isLightBox.events.callInit($obj);

                    var elementPath = $(this).attr('href');

                    $isLightBox.createIsLightBox(elementPath, options, $obj);
                });
            },
            events: {
                triggerEvent: function(event, $obj) {
                    $obj = (($obj === undefined) ? $(document) : $obj);

                    $obj.trigger('islb:' + event);
                },
                callInit: function($obj) {
                    plugin.isLightBox.events.triggerEvent('init', $obj);
                },
                callOpen: {
                    triggerEvent: function(event, $obj) {
                        plugin.isLightBox.events.triggerEvent('open:' + event, $obj);
                    },
                    before: function($obj) {
                        this.triggerEvent('before', $obj);
                    },
                    after: function($obj) {
                        this.triggerEvent('after', $obj);
                    }
                },
                callClose: {
                    triggerEvent: function(event, $obj) {
                        plugin.isLightBox.events.triggerEvent('close:' + event, $obj);
                    },
                    before: function($obj) {
                        this.triggerEvent('before', $obj);
                    },
                    after: function($obj) {
                        this.triggerEvent('after', $obj);
                    }
                }
            },
            setStyles: function(options) {
                var $styles = '<style type="text/css" id="islb-styles">.islb {background-color: ' + options.background + '; transition: opacity ' + options.revealSpeed / 1000 + 's ease-in-out;} .islb.islb-active {transition: opacity ' + options.revealSpeed / 1000 + 's ease-in-out;}</style>';

                $('head').find('#islb-styles').remove();

                $('head').append($styles);
            },
            createIsLightBox: function(elementPath, options, $obj) {
                var $isLightBox = this;

                $isLightBox.setStyles(options);

                var $islb = $('<div>', {'class': 'islb'}),
                    $islbClose = $('<div>', {'class': 'islb-close'}),
                    $islbNext = $('<div>', {'class': 'islb-next'}),
                    $islbPrev = $('<div>', {'class': 'islb-prev'}),
                    $islbContainer = $('<div>', {'class': 'islb-container'}),
                    $islbMediaContainer = $('<div>', {'class': 'islb-media-container'}),
                    $islbMedia = $('<div>', {'class': 'islb-media'});

                $islb.html([$islbClose, $islbNext, $islbPrev]).append(
                    $islbContainer.html(
                        $islbMediaContainer.html(
                            $islbMedia.html(
                                this.getElement.init(elementPath)
                            )
                        )
                    )
                );

                $('body').append($islb);

                $isLightBox.events.callOpen.before($obj);

                setTimeout(function() {
                    $islb.addClass('islb-active');

                    $isLightBox.events.callOpen.after($obj);
                }, 100);

                if (options.overlayClose) {
                    $islb.on('click', function(e) {
                        if(($(e.target).closest('.islb-media').length == 0 || $(e.target).hasClass('islb-media')) && (!$(e.target).hasClass('islb-next') && !$(e.target).hasClass('islb-prev'))) {
                            $isLightBox.destroyIsLightBox(options, $obj);
                        }
                    });
                } else {
                    $islbClose.on('click', function(e) {
                        $isLightBox.destroyIsLightBox(options, $obj);
                    });
                }

                if (options.escKey) {
                    $(document).on('keyup', function(e) {
                        if (e.keyCode == 27) {
                            $isLightBox.destroyIsLightBox(options, $obj);
                        }
                    });
                }
            },
            destroyIsLightBox: function(options, $obj) {
                var $isLightBox = this;

                $isLightBox.events.callClose.before($obj);

                $('.islb').removeClass('islb-active');

                $(document).off('keyup');

                setTimeout(function() {
                    $('.islb').remove();

                    $isLightBox.events.callClose.after($obj);
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
    };

    $.extend(plugin);
})(jQuery);

$(function() {
    $('[data-islightbox]').isLightBox();
});
