Ext.define('CGP.product.view.pricingStrategyv2.view.FieldSetForm', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.fieldsetform',
    collapsible: false,
    header: false,
    margin: '10 50 10 50',
    defaultType: 'displayfield',
    layout: 'fit',
    style: {
        borderRadius: '10px'
    },
    constructor: function (config) {
        var me = this;
        var tip = config.tipText;
        config.title = "<font size='2' style= ' color:green;font-weight: bold'>" + i18n.getKey(config.title) + '</font>'
        if (tip) {
            config.title += '<img  title="' + tip + '" style="cursor:pointer;margin:0 5px 4px 5px;vertical-align: middle;width:15px; height:15px" ' +
                'src="' + path + 'ClientLibs/extjs/resources/themes/images/shared/fam/help.png' + '"/>';

        }
        me.callParent(arguments);

    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.rendered == true) {
            me.items.items.forEach(function (item) {
                if (!item.hidden && item.isValid() == false) {
                    isValid = false;
                }
            });
        }
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridfield') {
                item.setSubmitValue(data[item.name])
            } else {
                item.setValue(data[item.name]);
            }
        })
    },
    getValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridfield') {
                item.store.sort('to', 'ASC');
                var gridData = [];
                item.store.each(function (record) {
                    record.data.index = record.index;
                    if (record.index == item.store.count() - 1) {
                        record.set('to', 2147483647);
                        record.data.to = 2147483647;
                    }
                    gridData.push(record.data);

                });
                data[item.name] = gridData;
            } else if (Ext.isEmpty(item.name)) {
                data = item.getValue();
            } else {
                data[item.name] = item.getValue();
            }
        });
    }
})
