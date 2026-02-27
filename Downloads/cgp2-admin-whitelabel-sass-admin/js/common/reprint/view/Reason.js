Ext.define('CGP.common.reprint.view.Reason', {
    extend: 'Ext.form.CheckboxGroup',
    alias: 'widget.reasonselector',

    columns: 1,
    items: [{
        boxLabel: '印刷刮花/针位不齐',
        name: 'reason',
        inputValue: '印刷刮花/针位不齐'
                }, {
        boxLabel: '过油刮花/皱烂',
        name: 'reason',
        inputValue: '过油刮花/皱烂'
                }, {
        boxLabel: '裱咭/冲咭/组装坏',
        name: 'reason',
        inputValue: '裱咭/冲咭/组装坏'
                }, {
        boxLabel: '文档异常',
        name: 'reason',
        inputValue: '文档异常'
                }, {
        boxLabel: '其他',
        name: 'reason',
        inputValue: '其他'
    }],


    initComponent: function () {
        var me = this;



        me.fieldLabel = i18n.getKey('reason');
        me.defaults = {
            width: 150,
            listeners: {
                change: function (radio, newValue, oldValue) {
                    var remarkField = this.ownerCt.ownerCt.getComponent('remark');
                    if (newValue === true) {
                        if (remarkField.getValue())
                            remarkField.setValue(remarkField.getValue() + radio.getSubmitValue() + '\n');
                        else {
                            remarkField.setValue(radio.getSubmitValue() + '\n');
                        }
                    } else {
                        var value = remarkField.getValue();
                        value = value.replace(radio.inputValue + '\n', '');
                        remarkField.setValue(value);
                    }
                }
            }
        };

        me.callParent(arguments);
    }
})