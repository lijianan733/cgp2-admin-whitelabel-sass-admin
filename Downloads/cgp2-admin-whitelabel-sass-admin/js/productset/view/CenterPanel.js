/**
 * Created by nan on 2021/4/6
 */
Ext.define("CGP.productset.view.CenterPanel", {
    extend: "Ext.tab.Panel",
    alias: 'widget.centerpanel',
    autoScroll: true,
    collapsible: true,
    region: 'center',
    header: false,
    split: true,
    viewConfig: {
        markDirty: false,
        stripeRows: true,
        forceFit: true, // 注意不要用autoFill:true,那样设置的话当GridPanel的大小变化（比如你resize了它）时不会自动调整column的宽度
        scrollOffset: 0 //不加这个的话，会在grid的最右边有个空白，留作滚动条的位置
    },
    layout: {
        type: 'fit'
    },
    rawData: null,
    treePanel: null,
    initComponent: function () {
        var me = this;
        me.items = [];
        me.callParent();
    },
    saveHandler: function () {
        var centerPanel = this;
        var form = centerPanel.items.items[0];
        var media = centerPanel.items.items[1];
        var controller = Ext.create('CGP.productset.controller.Controller');
        if (form.isValid()) {
            var data = null;
            if (form.diyGetValue) {
                data = form.diyGetValue();
            } else {
                data = form.getValue();
            }
            if (media) {
                data.medias = media.getValue();
            }
            controller.saveData(data, centerPanel);
        } else {
            centerPanel.setActiveTab(form);
        }
    },
    tbar: {
        hidden: true,
        items: [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var centerPanel = btn.ownerCt.ownerCt;
                    centerPanel.saveHandler();
                }
            }
        ]
    },
    refreshData: function (data) {
        //3中节点的展示
        var centerPanel = this;
        centerPanel.setLoading(true);
        setTimeout(function () {
            centerPanel.removeAll();
            var toolbar = centerPanel.getDockedItems('toolbar[dock="top"]')[0];
            var form = centerPanel.getComponent('form');
            if (data) {
                toolbar.show();
                centerPanel.rawData = data;
                if (data.clazz == 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet'
                    || data.clazz == 'com.qpp.cgp.domain.productssuit.SkuProductSet') {
                    var form = Ext.create('CGP.productset.view.ProductSetForm');
                    var media = Ext.create('CGP.product.edit.module.Media');
                    centerPanel.add([form, media]);
                    form.setValue(data);
                    if (data.medias) {
                        media.setValue(data.medias);
                    }
                } else if (data.clazz == 'com.qpp.cgp.domain.productssuit.CompleteSetItem'
                    || data.clazz == 'com.qpp.cgp.domain.productssuit.MultiSetItem'
                    || data.clazz == 'com.qpp.cgp.domain.productssuit.SingleSetItem') {
                    var form = Ext.create('CGP.productset.view.ProductSetItemForm', {
                        productSet: data.productSet
                    });
                    centerPanel.add(form);
                    //需要对数据进行处理
                    form.diySetValue(data);
                } else if (data.clazz == 'com.qpp.cgp.domain.productssuit.StaticProductScope') {
                    var a = Ext.create('CGP.productset.view.StaticProductScopeForm');
                    centerPanel.add(a);
                    a.setValue(data);

                } else if (
                    data.clazz == 'com.qpp.cgp.domain.productssuit.MainCategoryProductScope' ||
                    data.clazz == 'com.qpp.cgp.domain.productssuit.SubCategoryProductScope') {
                    var a = Ext.create('CGP.productset.view.CategoryProductScopeForm', {
                        clazz: data.clazz
                    });
                    centerPanel.add(a);
                    a.setValue(data);
                }
                /*       form.show();
                       form.setValue(data);*/
            } else {
                centerPanel.rawData = null;
                toolbar.hide();
            }
            centerPanel.setLoading(false);
        }, 300)

    }
});

