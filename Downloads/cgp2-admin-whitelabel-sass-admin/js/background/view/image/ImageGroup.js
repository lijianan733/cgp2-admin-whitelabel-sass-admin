/**
 *产品编辑页面 媒体模块的图片组组件
 */
Ext.define('CGP.background.view.image.ImageGroup', {
    extend: 'Ext.panel.Panel',
    autoScroll: true,
    requires: ['CGP.background.view.image.ImageItem'],
    medias: [],
    defaultImagePanel: null,
    layout: {
        type: 'table',
        columns: 2
    },
    imgWidth: 290,
    width: 800,
    imgHeight: 200,
    newTag: "<span class='badge badge-new pull-right'>New</span>",
    newImageItem: [],
    border: false,
    autoDestroy: false,
    readOnly: false,
    defaults: {
        width: 330
    },
    constructor: function (config) {
        var me = this;
        config = config || {};
        Ext.apply(me.config, config);
        me.initConfig(config);
        me.callParent([config]);
        me.on('afterrender', me.magnificImage);
    },
    setValue: function (data) {
        var me = this;
        me.medias = data;
        var medias = me.medias;
        for (var i = 0; i < medias.length; i++) {
            var image = medias[i];
            var imgUrl = imageServer + image.imageName + '/' + me.imgWidth + '/' + me.imgHeight;
            var popupImgUrl = imageServer + image.imageName;
            var imageItem = me.addImageItem({
                index: i,
                readOnly: me.readOnly,
                popupImgUrl: popupImgUrl,
                imgUrl: imgUrl,
                indexInMedias: i,
                sortOrder: image.sortOrder,
                imageData: image,
                imageDestroy: function () {
                    me.imageDestroy(this, me);
                }
            });
            if (image.sortOrder == 0) {
                me.defaultImagePanel = imageItem;
            }
            me.insert(i, imageItem);
        }
    },
    addImageItem: function (config) {
        var me = this;
        return Ext.create('CGP.background.view.image.ImageItem', config);
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