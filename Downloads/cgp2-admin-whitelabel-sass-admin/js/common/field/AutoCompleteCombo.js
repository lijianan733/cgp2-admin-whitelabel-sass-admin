/**
 * @Description:自动补全数据的combo
 * @author nan
 * @date 2022/7/5
 */
Ext.define('CGP.common.field.AutoCompleteCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.autocompletecombo',
    displayField: 'display',
    valueField: 'value',
    editable: true,
    labelWidth: 100,
    queryMode: 'local',
    hideTrigger: true,
    forceSelection: false,
    matchFieldWidth: false,
    autoSelect: false,
    vtype: 'email',
    store: {
        fields: [
            'display',
            'value',
            'template'//邮箱后缀模板
        ],
        data: [
            {
                template: '{input}@qq.com'
            },
            {
                template: '{input}@qpp.com'
            }
        ]
    },
    //重写查询的操作
    doRawQuery: function () {
        var me = this;
        var currentValue = this.getValue() || '';

        var index = currentValue.indexOf('@');
        //只匹配到@符前面的字符串
        if (index != -1) {
            currentValue = currentValue.slice(0, currentValue.indexOf('@'));
        }
        me.store.data.items.forEach(function (item) {
            item.beginEdit();
            var template = item.get('template');
            item.set('value', template.replace('{input}', currentValue));
            item.set('display', template.replace('{input}', currentValue));
            item.endEdit(true);
        });
        this.doQuery(this.getRawValue(), false, true);
        if (Ext.isEmpty(currentValue)) {
            me.collapse();
        }
    },
    initComponent: function () {
        var me = this;
        me.callParent();
    }
})