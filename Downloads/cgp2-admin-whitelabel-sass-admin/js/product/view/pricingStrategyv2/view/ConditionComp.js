/**
 * Created by admin on 2020/3/11.
 */
Ext.Loader.syncRequire(["CGP.product.view.pricingStrategyv2.model.PricingStrategy"]);
Ext.define("CGP.product.view.pricingStrategyv2.view.ConditionComp", {
    extend: 'Ext.form.Panel',
    alias: 'widget.conditioncomp',
    itemId: 'conditioncomp',
    border: 0,
    initComponent: function () {
        var me = this;

        var checkgroup = Ext.widget('radiogroup', {
                fieldLabel: i18n.getKey('parameterType'),
                padding: '10 20 0 20',
                hidden: me.parameterTypes.length < 2 ? true : false,
                columns: 3,
                name: 'type',
                itemId: 'parameterType',
                items: me.parameterTypes,
                listeners: {
                    change: function (Comp, newValue, oldValue) {
                        var attComp = me.getComponent('conditionGridPanel');
                        var qtyComp = me.getComponent('conditionQtyGridPanel');

                        if (newValue.parameterType == 'productAttribute') {
                            me.switchDisplay(attComp, qtyComp);
                        } else if (newValue.parameterType == 'qty') {
                            me.switchDisplay(qtyComp, attComp);
                        }
                    }
                }
            }
        );
        var conditionGridPanel = Ext.create('CGP.product.view.pricingStrategyv2.view.ConditionGrid', {
            width: '100%',
            itemId: 'conditionGridPanel',
            productId: me.productId,
            name: 'operation',
            minHeight: 100,
            margin: '0 20 30 20'
        });
        var conditionQtyGridPanel = Ext.create('CGP.common.condition.view.ConditionQtyGrid', {
            width: '100%',
            itemId: 'conditionQtyGridPanel',
            productId: me.productId,
            name: 'operation',
            minHeight: 100,
            margin: '0 20 30 20',
            hidden: true
        });
        me.items = [
            checkgroup,
            conditionGridPanel,
            conditionQtyGridPanel
        ];
        me.callParent();
        if (!Ext.isEmpty(me.data) && JSON.stringify(me.data) != '{}') {
            me.setValue(me.data);

        }
    },

    switchDisplay: function (displayComp, hidComp) {
        if (displayComp) {
            displayComp.setDisabled(false);
            displayComp.show();
        }
        if (hidComp) {
            hidComp.setDisabled(true);
            hidComp.hide();
        }
    },
    getValue: function () {
        var me = this;
        var result = null;
        Ext.Array.each(me.items.items, function (item) {
            if (!item.hidden && item.name != 'type') {
                result = item.getValue();
            }
        });
        return result;
    },
    setValue: function (data) {
        var me = this;
        if (Ext.Object.isEmpty(data)) {
            return;
        } else {
            var attComp = me.getComponent('conditionGridPanel');
            var qtyComp = me.getComponent('conditionQtyGridPanel');
            if (data.type && data.type == 'qty') {
                me.switchDisplay(qtyComp, attComp);
                qtyComp.setValue(data);
            } else {
                me.switchDisplay(attComp, qtyComp);
                attComp.setValue(data);
            }
            me.getComponent('parameterType').setValue({'parameterType': data.type});
        }
    },
    isValid: function () {
        var valid = true;
        var items = this.items.items;
        for (var i = 0; i < items.length; i++) {
            if (!items[i].hidden && items[i].isValid() == false) {
                valid = false;
            }
        }
        return valid;
    }
})


