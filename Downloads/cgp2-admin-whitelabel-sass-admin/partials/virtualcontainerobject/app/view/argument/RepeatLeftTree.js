/**
 * Created by miao on 2021/10/11.
 */
Ext.Loader.setPath('CGP.virtualcontainerobject', '../../../app');
Ext.define("CGP.virtualcontainerobject.view.argument.RepeatLeftTree", {
    extend: "CGP.virtualcontainerobject.view.argument.LeftTree",
    rtTypeId:-1,
    initComponent: function () {
        var me = this;
        me.tbar = [
            {
                xtype: 'button',
                itemId: 'addRepeat',
                text: i18n.getKey('add') + i18n.getKey('repeat') + i18n.getKey('rtType'),
                // disabled: true
                // handler:function (btn){
                //     var ttt=Ext.ComponentQuery.query('toolbar [itemId="addRepeat"]');
                // }
            }
        ];
        me.callParent(arguments);
    },
    getJsonObjectValue: function () {
        var me = this;
        return me.valueJsonObject;
    },
    getValue: function () {
        var me = this;
        var rtTypeId = me.currRtType;
        var rtType = {_id: rtTypeId, idReference: 'RtType', clazz: domainObj['RtType']};
        var rtObjectData = {
            "_id": me.data?._id || JSGetCommonKey().toString(),
            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
            "idReference": "RtObject",
            "rtType": rtType,

        };
        var repeatData = [];
        for (var k in me.valueJsonObject) {
            repeatData.push(me.valueJsonObject[k]);
        }
        rtObjectData["objectJSON"] = {"repeat": repeatData, "rtType": me.itemRtType};
        var rtObjectString = JSON.stringify(rtObjectData);
        Ext.Ajax.request({
            url: adminPath + 'api/bom',
            method: 'POST',
            async: false,
            jsonData: [
                {
                    "entities": [rtObjectString],
                    "entityName": "RtObject"
                }
            ],
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (!responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        return rtObjectData;

    },

    setValue: function (data) {
        var me = this;
        var controller = Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
        me.data = data;
        me.valueJsonObject = {};
        me.objectJson = data.objectJSON;
        // me.rtTypeId=data?.rtType?._id;
        me.getRootNode().removeAll();
        if (Ext.isArray(data.objectJSON.repeat)) {
            // me.objectJson=data.objectJSON.repeat.map(function (item,index){
            //     var obj={};
            //     obj['item_'+index]=item;
            //     return obj;
            // });
            me.store.proxy.url = adminPath + 'api/rtTypes/' + data.objectJSON?.rtType._id + '/rtAttributeDefs';
            data.objectJSON.repeat.forEach(function (itemValue) {
                controller.addItemNode(me, data.objectJSON?.rtType, itemValue);
            })
        }

    },

})
;
