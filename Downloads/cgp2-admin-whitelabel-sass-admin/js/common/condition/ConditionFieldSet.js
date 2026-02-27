/**
 * Created by miao on 2021/01/18.
 * 简易的判断条件窗口，最终将组成expressDTO的数据
 * profile,有选择切面，属性为该产品所有属性
 *
 *
 */
Ext.define('CGP.common.condition.ConditionFieldSet', {
    extend: 'CGP.common.condition.DiyFieldSet',
    alias: 'widget.conditionfieldset',
    initComponent: function () {
        var me = this;
        var conditionGridPanel = Ext.create('CGP.common.condition.AttributeConditionFieldset', {
            leftAttributes: [],
            width: '100%',
            title: '',
            header: false,
            border: false,
            itemId: 'conditionGridPanel',
            productId: me.productId,
            haveElse: false,
            minHeight: 50,
            margin: '0 0 30 0'
        });
        var profileItem = [];
        var url = (adminPath + 'api/attributeProfile?' + 'page=1&start=0&limit=25&filter=[{"name":"productId","value":' + me.productId + ',"type":"number"}]');
        JSAjaxRequestForAttributeVersion(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    for (var i = 0; i < responseMessage.data.content.length; i++) {
                        var item = responseMessage.data.content[i];
                        profileItem.push({
                            boxLabel: item.name,
                            name: 'profile',
                            inputValue: item._id,
                            checked: i == 0
                        })
                    }
                }
            }
        });
        var checkgroup = Ext.widget('checkboxgroup', {
            fieldLabel: 'profile',
            padding: '10 20 0 25',
            columns: 3,
            itemId: 'profile',
            vertical: false,
            labelWidth: 95,
            items: profileItem
        });
        me.items = [
            checkgroup,
            conditionGridPanel
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var conditionGridPanel = me.getComponent('conditionGridPanel');
        var profile = me.getComponent('profile');
        var profileValue = Ext.Object.isEmpty(profile.getValue()) ? null : profile.getValue().profile;
        if (Ext.isEmpty(profileValue)) {

        } else {
            profileValue = profileValue.toString();
            profileValue = profileValue.split(',');
        }

        var executeAttributeInput = conditionGridPanel.getValue();
        if (executeAttributeInput) {
            executeAttributeInput.conditionType == 'normal';//现在默认都为normal
        }
        var result = {
            clazz: 'com.qpp.cgp.domain.executecondition.ExecuteCondition',
            executeProfileItemIds: profileValue,
            executeAttributeInput: executeAttributeInput
        };
        console.log(result);
        return result;
    },
    setValue: function (data) {
        var me = this;
        if (Ext.Object.isEmpty(data)) {
            return;
        } else {
            var profile = me.getComponent('profile');
            var conditionGridPanel = me.getComponent('conditionGridPanel');
            profile.setValue({profile: data.executeProfileItemIds});
            conditionGridPanel.setValue(data.executeAttributeInput);
        }
    },
    isValid: function () {
        var valid = true;
        for (var i = 0; i < this.items.items.length; i++) {
            if (this.items.items[i].isValid() == false) {
                valid = false;
            }
        }
        return valid;
    }
})


