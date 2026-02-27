Ext.define("CGP.product.edit.view.SkuProductTab", {
    extend: "Ext.tab.Panel",

    region: 'center',
    initComponent: function () {
        var me = this;

        me.listeners = {
            tabchange: function () {
                if (this.getActiveTab().title == '模板') {
                    Ext.getCmp('producePageBtn').setVisible(true);
                } else {
                    Ext.getCmp('producePageBtn').setVisible(false);
                }
                if (!Ext.isEmpty(this.data.id) && this.getActiveTab().title == '信息') {
                    Ext.getCmp('multilangual').setVisible(true);
                } else {
                    Ext.getCmp('multilangual').setVisible(false);
                }
                Ext.Array.each(this.items.items, function (item) {
                    if (item.msgPanel) {
                        item.msgPanel.setVisible(false);
                    }
                })
            }
        };
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
                handler: function () {
                    skuData = skuData || {};
                    var template = templateBlock.content.form.getValuesByModel('CGP.model.ProductTemplate');
                    var tab = templateBlock.ownerCt;
                    var isValid = true;
                    for (var i = 0; i < tab.items.items.length; i++) {
                        var item = tab.items.items[i];
                        if (item.isValid && !item.isValid()) {
                            isValid = false;
                            tab.setActiveTab(item);
                            break;
                        }
                    }
                    if (isValid == false) {
                        return;
                    } else {
                        tab.el.mask('加载中..');
                        tab.updateLayout();
                        skuData.template = template;
                        //skuData.relatedProducts = relatedProductBlock.getValue();
                        var info = infoBlock.getValue();
                        skuData = Ext.merge(skuData, info);
                        var attributeValues = attributeBlock.getValue();
                        skuData.medias = mediaBlock.getValue();
                        skuData.attributeValues = attributeValues;
                        skuData.mainCategory = data.mainCategory;
                        skuData.skuAttributes = null;
                        skuData.configurableProductId = me.controller.configurableProductId;
                        var product = new CGP.model.Product(skuData);
                        //保存?品
                        product.save({
                            callback: function (records, operation, success) {
                                tab.el.unmask();
                                if (success) {
                                    Ext.Msg.alert('提示', '保存成功!');
                                    var responseData = Ext.JSON.decode(operation.response.responseText).data;
                                    window.productId = responseData.id;
                                    infoBlock.content.getComponent('id').setValue(responseData.id);
                                    infoBlock.content.setValue(responseData);
                                    me.data = responseData;
                                } else {
                                    Ext.Msg.alert('提示', '保存失败,错误信息：' + operation.error.statusText);
                                }
                            }
                        });
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('producePage'),
                id: 'producePageBtn',
                hidden: true,
                handler: function () {
                    if (data.invisible == false) {
                        Ext.create('CGP.product.view.producepage.ProducePageWin', {
                            website: data.mainCategory.website,
                            productId: data.id,
                            record: data
                        }).show();
                    } else {
                        Ext.Msg.alert('提示', '此产品不能生成页面！');
                    }
                }
            },
            {
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
});
