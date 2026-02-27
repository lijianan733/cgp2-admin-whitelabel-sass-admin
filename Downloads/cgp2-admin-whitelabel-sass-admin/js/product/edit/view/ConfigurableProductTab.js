Ext.define("CGP.product.edit.view.ConfigurableProductTab", {
    extend: "Ext.tab.Panel",

    region: 'center',
    listeners: {
        tabchange: function () {
            if (arguments[2].msgPanel) {
                arguments[2].msgPanel.hide();
            }
            if (!Ext.isEmpty(this.data.id) && this.getActiveTab().title == '信息') {
                Ext.getCmp('multilangual').setVisible(true);
            } else {
                Ext.getCmp('multilangual').setVisible(false);
            }
        }
    },
    initComponent: function () {
        var me = this;

        var infoBlock = me.infoBlock;
        var mediaBlock = me.mediaBlock;
        var templateBlock = me.templateBlock;
        var attributeBlock = me.attributeBlock;
        //var relatedProductBlock = me.relatedProductBlock;
        var data = me.data;
        var skuData = me.skuData;

        me.items = [infoBlock.content, mediaBlock.content, templateBlock.content, attributeBlock.content];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: me.saveConfigurableProduct
            },
            {
                xtype: 'button',
                iconCls: 'icon_copy',
                hidden: true,
                text: i18n.getKey('copy'),
                handler: me.copyProduct
            }, {
                xtype: 'button',
                text: i18n.getKey('config') + i18n.getKey('multilingual'),
                iconCls: 'icon_multilangual',
                id: 'multilangual',
                hidden: Ext.isEmpty(me.data.id),
                itemId: 'multilangual',
                handler: function () {
                    var id = me.data.id;
                    var mediaArr = me.data.medias.map(function (media) {
                        return media.id;
                    }).toString();
                    var mediaNameArr = me.data.medias.map(function (media) {
                        return media.name;
                    }).toString();
                    var title = 'product';
                    var pageTplId = me.data.template.id;
                    var multilingualKey = me.data.multilingualKey || me.data.clazz;
                    JSOpen({
                        id: 'edit' + '_multilingual',
                        url: path + "partials/product/editmultilingual.html?id=" + id + '&title=' + title + '&multilingualKey=' + multilingualKey + '&mediaArr=' + mediaArr + '&mediaNameArr=' + mediaNameArr + '&pageTplId=' + pageTplId,
                        title: i18n.getKey(title) + i18n.getKey('multilingual') + i18n.getKey('config') + '(' + i18n.getKey('id') + ':' + id + ')',
                        refresh: true
                    })
                }
            }
        ];
        me.callParent(arguments);
    }
})