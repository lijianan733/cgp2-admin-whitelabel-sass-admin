/**
 *产品编辑页面 媒体模块的图片组组件
 */
Ext.define('CGP.product.edit.component.image.ImageGroup', {
    extend: 'Ext.panel.Panel',
    requires: ['CGP.product.edit.component.image.ImageItem'],
    medias: [],
    defaultImagePanel: null,

    imgWidth: 291,
    imgHeight: 200,
    popupImgWidth: 600,
    popupImgHeight: 400,


    defaultTag: "<span class='badge badge-default pull-right'>Default</span>",
    newTag: "<span class='badge badge-new pull-right'>New</span>",

    newImageItem: [],

    config: {
        id: 'product-image',
        border: false,
        autoDestroy: false,
        defaults: {
            width: 400
        }
    },


    constructor: function (config) {

        var me = this;
        config = config || {};

        Ext.apply(me.config, config);
        me.initConfig(config);
        config.layout = 'column';
        config.width = '100%';
        me.callParent([config]);

        me.on('afterrender', me.magnificImage);

    },

    setValue: function (data) {
        var me = this;
        me.medias = data;
        var medias = me.medias;
        for (var i = 0; i < medias.length; i++) {

            var image = medias[i];

            if (image.type != "PRODUCT_IMAGE")
                continue;

            var imgUrl = imageServer + image.name + '/' + me.imgWidth + '/' + me.imgHeight;
            var popupImgUrl = imageServer + image.name + '/' + me.popupImgWidth + '/' + me.popupImgHeight;
            var imageItem = me.addImageItem({
                index: i,
                popupImgUrl: popupImgUrl,
                imgUrl: imgUrl,
                indexInMedias: i,
                sortOrder: image.sortOrder,
                imageDestroy: function () {
                    me.imageDestroy(this, me);
                },
                imageDefault: function () {
                    me.imageDefault(this, me);
                },
                listeners: {
                    sortorderchange: function (view, newValue, oldValue) {
                        me.medias[this.indexInMedias].sortOrder = newValue;
                    }
                }
            });

            if (image.sortOrder == 0) {
                me.defaultImagePanel = imageItem;
                me.defaultImagePanel.html += me.defaultTag;

            }
            me.insert(i, imageItem);
        }

    },


    addImageItem: function (config) {
        var me = this;
        return Ext.create('CGP.product.edit.component.image.ImageItem', config);
    },

    afterUploadImage: function (response) {
        var me = this;
        var medias = me.medias;
        var mediaType = 'PRODUCT_IMAGE';
        if (!response.success) {
            Ext.Msg.alert('提示', response.message);
            return;
        }
        var uoloapImageResponseDatas = response.data;
        Ext.Array.each(uoloapImageResponseDatas, function (uoloapImageResponseData) {
            uoloapImageResponseData.type = mediaType;
            var data = {
                name: uoloapImageResponseData.name,
                //默认为图片
                type: uoloapImageResponseData.type,
                format: uoloapImageResponseData.format,
                width: uoloapImageResponseData.width,
                height: uoloapImageResponseData.height,
                clazz: 'com.qpp.cgp.domain.product.media.ProductMedia',
                originalFileName: uoloapImageResponseData.originalFileName,
                sortOrder: medias.length > 0 ? (medias[medias.length - 1].sortOrder + 1) : 0
            };
            medias.push(data);
            var imgUrl = imageServer + data.name + '/' + me.imgWidth + '/' + me.imgHeight;
            var popupImgUrl = imageServer + data.name + '/' + me.popupImgWidth + '/' + me.popupImgHeight;


            var imageItem = Ext.create('CGP.product.edit.component.image.ImageItem', {
                popupImgUrl: popupImgUrl,
                imgUrl: imgUrl,
                indexInMedias: medias.length - 1,
                status: 'addNew',
                isnew: true,
                imageDestroy: function () {
                    me.imageDestroy(this, me);
                },
                imageDefault: function () {
                    me.imageDefault(this, me);
                },
                sortOrder: data.sortOrder,
                listeners: {
                    sortorderchange: function (view, newValue, oldValue) {
                        medias[this.indexInMedias].sortOrder = newValue;
                    }
                }
            })
            if (me.items.length == 0) {
                me.defaultImagePanel = imageItem;
            }
            me.newImageItem.push(imageItem);
            var position = me.items.length;
            me.insert(position, imageItem);
            if (me.items.length == 1) {
                me.addDefaultTag(imageItem.getEl().id);
            }
        });
        //var uoloapImageResponseData = response.data[0];
        /*uoloapImageResponseData.type = mediaType;
        var data = {
            name: uoloapImageResponseData.name,
            //默认为图片
            type: uoloapImageResponseData.type,
            format: uoloapImageResponseData.format,
            width: uoloapImageResponseData.width,
            height: uoloapImageResponseData.height,
            originalFileName: uoloapImageResponseData.originalFileName,
            sortOrder: medias.length > 0 ? (medias[medias.length - 1].sortOrder + 1) : 0
        };
        medias.push(data);
        var imgUrl = imageServer + data.name + '/' + me.imgWidth + '/' + me.imgHeight;
        var popupImgUrl = imageServer + data.name + '/' + me.popupImgWidth + '/' + me.popupImgHeight;


        var imageItem = Ext.create('CGP.product.edit.component.image.ImageItem', {
            popupImgUrl: popupImgUrl,
            imgUrl: imgUrl,
            indexInMedias: medias.length - 1,
            status: 'addNew',
            isnew: true,
            imageDestroy: function () {
                me.imageDestroy(this, me);
            },
            imageDefault: function () {
                me.imageDefault(this, me);
            },
            sortOrder: data.sortOrder,
            listeners: {
                sortorderchange: function (view, newValue, oldValue) {
                    medias[this.indexInMedias].sortOrder = newValue;
                }
            }
        })
        if (me.items.length == 0) {
            me.defaultImagePanel = imageItem;
        }
        me.newImageItem.push(imageItem);
        var position = me.items.length;
        me.insert(position, imageItem);
        if (me.items.length == 1) {
            me.addDefaultTag(imageItem.getEl().id);
        }*/
        Ext.Msg.alert('Promo', 'Product Image upload success!');
    },

    imageDestroy: function (field, me) {
        var medias = me.medias;
        var defaultImagePanel = me.defaultImagePanel;
        var imageItem = field.ownerCt.ownerCt;
        medias.splice(imageItem.indexInMedias, 1);

        Ext.Array.remove(me.newImageItem, imageItem);
        me.remove(imageItem);

        if (imageItem == defaultImagePanel)
            me.defaultImagePanel = undefined;


        //将该imageItem后面的imageItem的indexInMedias减1
        for (var i = imageItem.indexInMedias; i < me.items.length; i++) {

            me.items.get(i).indexInMedias -= 1;

        }

        imageItem.destroy();


    },

    imageDefault: function (field, me) {

        var medias = me.medias;
        var defaultImagePanel = me.defaultImagePanel;
        if (field.ownerCt.getComponent('sortOrder').getValue() != 0) {
            //与默认image交换sortOrder
            var sortOrder = medias[field.ownerCt.ownerCt.indexInMedias].sortOrder;
            if (defaultImagePanel) {
                defaultImagePanel.dockedItems.items[0].getComponent('sortOrder').setValue(sortOrder);
                medias[defaultImagePanel.indexInMedias].sortOrder = sortOrder;

                defaultImagePanel.sortOrder = sortOrder;
                //移除之前的default样式
                me.removeDefaultTag(defaultImagePanel.getEl().id);
            }
            medias[field.ownerCt.ownerCt.indexInMedias].sortOrder = 0;
            field.ownerCt.getComponent('sortOrder').setValue(0);
            defaultImagePanel = field.ownerCt.ownerCt;
            defaultImagePanel.sortOrder = 0;
            me.addDefaultTag(defaultImagePanel.getEl().id);
            me.defaultImagePanel = defaultImagePanel;
        }
    },

    addDefaultTag: function (id) {
        $('#' + id + ' .image-item').after(this.defaultTag)
    },


    removeDefaultTag: function (id) {
        //jquery
        $('#' + id + ' .badge.badge-default.pull-right').remove();
    },

    removeNewTag: function (id) {
        $('#' + id + ' .badge.badge-new.pull-right').remove();
    },

    magnificImage: function (p) {
        $('#' + p.getEl().id).magnificPopup({
            type: 'image',
            delegate: 'a.image-item',
            closeOnContentClick: false,
            closeBtnInside: false,
            mainClass: 'mfp-with-zoom mfp-img-mobile',
            image: {
                verticalFit: true
            },
            gallery: {
                enabled: true
            },
            zoom: {
                enabled: true,
                duration: 300, // don't forget to change the duration also in CSS
                opener: function (element) {
                    return element.find('img');
                }
            }
        });
    },

    getValue: function () {
        var me = this;
        me.removeNewTags();
        me.imageItemSort();
        return me.medias;
    },

    imageItemSort: function () {
        var me = this;
        var imageItems = me.removeAll(false);
        var sortedItems = Ext.Array.sort(imageItems, function (i1, i2) {
            return i1.sortOrder - i2.sortOrder;
        })

        me.add(sortedItems);
    },

    removeNewTags: function () {
        var me = this;
        //清除new标记
        Ext.Array.each(me.newImageItem, function (imageItem) {
            if(imageItem.getEl()){
                me.removeNewTag(imageItem.getEl().id);
            }
        })
        me.newImageItem = [];
    },
    copy: function () {
        var me = this;
        Ext.Array.each(me.medias, function (media) {
            media.id = null;
        })
    }

})