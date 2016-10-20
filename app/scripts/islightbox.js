(function($) {
    $.fn.isLightBox = function(config) {
        var defaults = {
            revealSpeed: 400,
            background: 'rgba(0,0,0,.8)',
            overlayClose: true,
            escKey: true,
            infinite: false,
            /*
            navKey: true,
            callbackError: function() {},
            callbackPrev: function() {},
            callbackNext: function() {},
            */
        };

        var options = $.extend({}, defaults, config);

        $(this).each(function() {
            $.isLightBox.init($(this), options);
        });
    };

    var plugin = {
        isLightBox: {
            gallery: [],
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
            refreshArrows: function(currentItem, gallery, options) {
                if (!options.infinite) {
                    this.refreshNext(currentItem, gallery);

                    this.refreshPrev(currentItem, gallery);
                }
            },
            refreshNext: function(currentItem, gallery) {
                var controlItem = currentItem+1;

                if (controlItem === this.gallery[gallery].length) {
                    $('.islb-next').addClass('islb-disabled');
                } else {
                    $('.islb-next').removeClass('islb-disabled');
                }
            },
            refreshPrev: function(currentItem, gallery) {
                if (currentItem === 0) {
                    $('.islb-prev').addClass('islb-disabled');
                } else {
                    $('.islb-prev').removeClass('islb-disabled');
                }
            },
            createIsLightBox: function(elementPath, options, $obj) {
                var $isLightBox = this,
                    gallery = $obj.data('islightbox');

                var $islb = $('<div>', {'class': 'islb'}),
                    $islbClose = $('<div>', {'class': 'islb-close'}),
                    $islbNext = $('<div>', {'class': 'islb-next'}),
                    $islbPrev = $('<div>', {'class': 'islb-prev'});

                $isLightBox.setStyles(options);

                if (gallery !== '') {
                    $islb.addClass('islb-gallery');

                    if ($isLightBox.gallery[gallery] === undefined) {
                        $isLightBox.gallery[gallery] = [];

                        $('[data-islightbox="' + gallery + '"]').each(function(index) {
                            $isLightBox.gallery[gallery][index] = {
                                path: $(this).attr('href')
                            };

                            $(this).attr('data-islightbox-counter', index);
                        });
                    }

                    var currentItem = $obj.data('islightbox-counter');

                    $islbNext.on('click', function() {
                        if (!$(this).hasClass('islb-disabled')) {
                            if (currentItem === $isLightBox.gallery[gallery].length - 1) {
                                currentItem = -1;
                            }

                            $isLightBox.gotoToElement($isLightBox.gallery[gallery][currentItem+1].path);
                            currentItem++;
                            $isLightBox.refreshArrows(currentItem, gallery, options);
                        }
                    });

                    $islbPrev.on('click', function() {
                        if (!$(this).hasClass('islb-disabled')) {
                            if (currentItem === 0) {
                                currentItem = $isLightBox.gallery[gallery].length;
                            }

                            $isLightBox.gotoToElement($isLightBox.gallery[gallery][currentItem-1].path);
                            currentItem--;
                            $isLightBox.refreshArrows(currentItem, gallery, options);
                        }
                    });
                }

                $islb.html([$islbClose, $islbNext, $islbPrev]).append($isLightBox.getContainer(elementPath));

                $('body').append($islb);

                $isLightBox.refreshArrows(currentItem, gallery, options);

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
            getContainer: function(elementPath) {
                var $islbContainer = $('<div>', {'class': 'islb-container'}),
                    $islbMediaContainer = $('<div>', {'class': 'islb-media-container'}),
                    $islbMedia = $('<div>', {'class': 'islb-media'});

                return $islbContainer.html($islbMediaContainer.html($islbMedia.html(this.getElement.init(elementPath))));
            },
            gotoToElement: function(elementPath) {
                var $container = this.getContainer(elementPath);

                $container.css({'opacity': 0});

                $('.islb .islb-container').animate({'opacity': 0}, 'slow', function() {
                    $('.islb .islb-container').remove();

                    $('.islb').append($container);

                    $container.animate({'opacity': 1}, 'slow');
                });
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
