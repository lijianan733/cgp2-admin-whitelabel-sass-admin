/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.tools.freemark.template.view.KeyForm", {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.keysform',
    requires: [],
    region: 'center',
    border: 0,
    width: '100%',
    data: null,
    initComponent: function () {
        var me = this;
        me.tbar = [
//            '->',
            {
                text: i18n.getKey('add')+i18n.getKey('variable'),
                iconCls: 'icon_add',
                handler: function (comp) {
                    me.createKeyRecord(null);
                }
            }
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.data)) {
                comp.setValue(comp.data);
            }
        }
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(data, function (item) {
            me.createKeyRecord(item);
        })
    },
    getValue: function () {
        var me = this;
        var items = me.items.items;
        var data = [];
        Ext.Array.each(items, function (item) {
            data.push(item.getValue());
        });
        return data;
    },
    isValid: function () {
        var me = this, isValid = true, errors = {duplicateDefine:''}, currKeys = [];
        if(me.disabled){
            return isValid;
        }
        me.items.items.forEach(function (item) {
            var varObj = item.getValue();
            if(!item.isValid()){
                isValid=false;
                return false;
            }
            //当前组是否有同名变量
            if (Ext.Array.contains(currKeys, varObj.name)) {
                errors['duplicateDefine'] += varObj.name + ' ; ';
                isValid = false;
            } else {
                //已添加组是否有同名变量
                me.ownerCt.variableStore.each(function (record) {
                    if (me.ownerCt.currRecord?.id != record.id && record.get('varKeys')) {
                        var varExcites = record.get('varKeys').map(function (key) {
                            return key.name;
                        })
                        if (Ext.Array.contains(varExcites, varObj.name)) {
                            errors['duplicateDefine'] += varObj.name + ' ; ';
                            isValid = false;
                        }
                    }
                })
            }
            currKeys.push(varObj.name);
        });
        if (!isValid) {
            me.showErrors(errors);
            return isValid
        }
        return isValid;
    },
    createKeyRecord: function (itemData) {
        var me = this;
        var items = me.items.items;
        var keyRecord = Ext.create('CGP.tools.freemark.template.view.KeyRecord', {
            data: itemData
        });
        me.insert(items.length, keyRecord);
        return keyRecord;
    }
});
