/**
 * Created by admin on 2020/3/13.
 */
Ext.define('CGP.product.view.pricingStrategyv2.view.ConditionColumn', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.conditioncolu',
    //id: col + '_' + row + '_' + grid.componentUUId,
    layout: 'hbox',
    defaults: {
        allowBlank: false,
        flex: 1
    },
    isValid: function () {
        var container = this;
        var valid = true;
        for (var i = 0; i < container.items.items.length; i++) {
            var item = container.items.items[i];
            if (item.isValid() == false) {
                valid = false;
            }
        }
        return valid;
    },
    getValue: function () {
        var container = this;
        var result = [];//如果长度大于1证明是区间操作符
        for (var i = 0; i < container.items.items.length; i++) {
            var item = container.items.items[i];
            if (item.hidden == false) {
                result[item.getName()] = item.getValue();
            }
        }
        return result;
    },
    setValue: function (value) {
        var container = this;
        if (Object.keys(value).length > 1) {
            //区间操作符\
            var min = container.getComponent('min');
            var max = container.getComponent('max');
            min.setValue(value.min);
            max.setValue(value.max);
        } else {
            for (var i = 0; i < container.items.items.length; i++) {
                var item = container.items.items[i];
                if (item.hidden == false) {
                    if (item.xtype == 'multicombobox') {//选项值
                        item.setValue(value.input.split(','))
                    } else {
                        item.setValue(value.input)
                    }
                }
            }
        }
    }
})