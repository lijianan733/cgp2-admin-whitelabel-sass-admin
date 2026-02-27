/**
 * Created by nan on 2020/5/21.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.ProductSkuAttributeForm', {
    extend: 'Ext.form.Panel',
    skuAttributeStore: null,
    itemId: 'form',
    defaults: {
        margin: '5 45 5 45',
        width: 350/*,
                            allowBlank: false*/
    },
    maxHeight: 500,
    overflowX: 'hidden',
    overflowY: 'auto',
    isReadOnly: false,
    setValue: function (data) {
        var form = this;
        form.items.items.forEach(function (item) {
            if (item.disabled == false) {
                if (item.xtype == 'datetimefield') {
                    item.setValue(new Date(data[item.getName()]));
                } else {
                    item.setValue(data[item.getName()]);
                }
            }
        })
    },
    initComponent: function () {
        var me = this;
        var skuAttributeStore = me.skuAttributeStore;
        var formItems = [];
        for (var i = 0; i < skuAttributeStore.getCount(); i++) {
            var skuAttribute = skuAttributeStore.getAt(i).getData();
            var field = Qpp.CGP.util.createFieldByAttributeV2(skuAttribute.attribute, {
                msgTarget: 'side',
                padding: '10 10 5 10',
                validateOnChange: false,
                readOnly: me.isReadOnly,
                allowBlank: true
            });
            formItems.push(field);
        }
        me.items = formItems;
        me.callParent();
    }
})
