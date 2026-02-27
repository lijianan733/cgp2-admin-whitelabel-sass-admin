/**
 *产品编辑页面 媒体模块的图片item组件
 */
Ext.define('CGP.background.view.image.ImageItem', {
    extend: 'Ext.panel.Panel',
    margin: '10 10 0 10',
    newTag: "<span class='badge badge-new pull-right'>New</span>",
    defaultSortOrder: 1,
    minSortOrder: 0,
    bodyStyle: 'border-color:white;',
    config: {
        height: 260,
        style: 'margin:10px'
    },
    style: {
        textAlign: 'center'
    },
    imageData: null,
    readOnly: true,
    htmlTemplate: new Ext.Template("<a class='image-item' href='{popupImgUrl}'><img class='thumb' src='{imgUrl}'>{newTag}"),
    constructor: function (config) {
        var me = this;
        config = config || {};
        me.addEvents('sortorderchange', 'sortorderblur');
        if (config.isnew === true) {
            config = Ext.apply(config, {
                newTag: me.newTag
            });
        }

        config = Ext.apply(config, {
            html: me.htmlTemplate.apply({
                popupImgUrl: config.popupImgUrl,
                imgUrl: config.imgUrl,
            })
        })
        me.initConfig(config);


        me.callParent([config]);

    },

    initComponent: function () {

        var me = this;
        me.dockedItems = {
            xtype: 'toolbar',
            dock: 'bottom',
            border: false,
            height: 50,
            width: '100%',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'button',
                    margin: '2 5 0 5',
                    tooltip: '删除配置',
                    componentCls: 'btnOnlyIcon',
                    hidden: me.readOnly,
                    icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
                    handler: function (btn) {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            if (selector == 'yes') {
                                //触发修改事件
                                var container = me.ownerCt;
                                var controller = Ext.create('CGP.background.controller.Controller');
                                controller.deleteBackgroundSize(me.imageData._id, container, me);
                            }
                        })
                    }
                },
                {
                    xtype: 'displayfield',
                    text: i18n.getKey('destroy'),
                    value: function () {
                        return me.imageData.imageWidth + '*' + me.imageData.imageHeight;
                    }()
                }
            ]
        };
        me.callParent(arguments);

    }

})