/**
 *产品编辑页面 媒体模块的图片item组件
 */
Ext.define('CGP.product.edit.component.image.ImageItem', {

    extend: 'Ext.panel.Panel',

    newTag: "<span class='badge badge-new pull-right'>New</span>",
    defaultTag: "<span class='badge badge-default pull-right'>Default</span>",


    defaultSortOrder: 1,
    minSortOrder: 0,
    bodyStyle: 'border-color:white;',
    config: {
        height: 230,
        style: 'margin:10px'
    },
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
                sortOrder: config.sortOrder || me.defaultSortOrder,
                indexInMedias: config.indexInMedias,
                newTag: config.newTag
            })
        })
        me.initConfig(config);


        me.callParent([config]);

    },

    initComponent: function () {

        var me = this;
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                border: false,
                bodyStyle: 'border-color:white;',
                items: [
                    {
                        margin: '0 0 0 50',
                        text: i18n.getKey('destroy'),
                        handler: me.imageDestroy
                    },
                    {
                        text: i18n.getKey('default'),
                        margin: '0 0 0 5',
                        handler: me.imageDefault
                    },
                    {

                        xtype: 'numberfield',
                        itemId: 'sortOrder',
                        hideTrigger: true,
                        value: me.sortOrder,
                        fieldLabel: '#',
                        labelWidth: 30,
                        labelAlign: 'right',
                        width: 70,
                        listeners: {
                            change: function (view, newValue, oldValue) {
                                me.fireEvent('sortorderchange', view, newValue, oldValue);
                            },
                            blur: function () {
                                if (this.getValue() <= me.minSortOrder) {
                                    Ext.Msg.alert('Error', 'sortOrder must bigger than ' + me.minSortOrder);
                                    this.setValue(me.defaultSortOrder);
                                }
                            }
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);

    }

})