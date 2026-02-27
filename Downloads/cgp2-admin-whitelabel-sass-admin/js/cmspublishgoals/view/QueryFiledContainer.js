Ext.define('CGP.cmspublishgoals.view.QueryFiledContainer',{
    extend: 'Ext.form.Panel',
    alias: 'widget.queryfieldcontainer',
    /*defaults: {
        width: 350
    },*/
    bodyStyle: 'padding:10px;border-color:silver;',
    header: {
        style: 'background-color:white',
        color: 'black',
        border: '0 0 0 0'
    },
    height: 155,

    hideHeaders: true,
    initComponent: function(){
        var me = this;
        me.title = '<font color=green>' + me.title + '</font>';
        var type = {
            xtype : 'combo',
            itemId : 'type',
            name : 'type',
            width: 500,
            fieldLabel : "<font style= ' color:green'>" + i18n.getKey('type') + '</font>',
            displayField : 'name',
            valueField : 'value',
            queryMode : 'local',
            editable : false
        };
        me.defaults= {
            labelWidth: 50,
            width: 500
        };
        if(me.type == 'filter'){
            type.store = Ext.create('Ext.data.Store',{
                fields: ['name','value'],
                data: [{name: 'EXPRESSION',value: 'EXPRESSION'}]
            });
        }else if(me.type == 'query'){
            type.store = Ext.create('Ext.data.Store',{
                fields: ['name','value'],
                data: [{name: 'SQL',value: 'SQL'}]
            })
        }
        me.items= [
            {
                fieldLabel: "<font style= ' color:green'>" + i18n.getKey('value') + '</font>',
                name : 'value',
                width: 500,
                xtype: 'textarea',
                itemId : "value"
            },type,{
                fieldLabel : i18n.getKey('id'),
                name : 'id',
                hidden: true,
                width: 500,
                xtype: 'numberfield',
                itemId : "id"
            }
        ];
        me.callParent(arguments);
    },
    getValue:function(){
        var me = this;
        var value = me.getComponent('id').getValue();
        if(!Ext.isEmpty(value)){
            return value;
        }else{
            return null;
        }
    },
    setValue: function(id){
        var me = this;
        var url;
        if(me.type == 'query'){
            url = adminPath + 'api/cmsEntityQuery/'+id;
        }else if(me.type == 'filter'){
            url = adminPath + 'api/cmsEntityFilters/'+id
        }
        var request = {
            url: url,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                var data = responseMessage.data;
                if(responseMessage.success){
                    Ext.Array.each(me.items.items,function(item){
                        item.setValue(data[item.name]);
                    })
                }else{
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }

            },
            failure: function (resp) {
                var responseMessage = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        };
        if(!Ext.isEmpty(id)){
            Ext.Ajax.request(request);
        }
    },
    save: function(mask){
        var me = this;
        var id = me.getComponent('id').getValue();
        var url;
        var method;
        if(me.type == 'query'){
            if(Ext.isEmpty(id)){
                url = adminPath + 'api/cmsEntityQuery';
                method = 'POST';
            }else{
                url = adminPath + 'api/cmsEntityQuery/'+id;
                method = 'PUT';
            }
        }else if(me.type = 'filter'){
            if(Ext.isEmpty(id)){
                url = adminPath + 'api/cmsEntityFilters';
                method = 'POST';
            }else{
                url = adminPath + 'api/cmsEntityFilters/'+id;
                method = 'PUT';
            }
        }
        var data = {};
        Ext.Array.each(me.items.items,function(item){
            if(item.name == 'id'){
                if(Ext.isEmpty(item.getValue())){

                }else{
                    data[item.name] = item.getValue();
                }
            }else{
                data[item.name] = item.getValue();
            }
        });
        var dataIsEmpty;
        Ext.Object.each(data,function(key, value){
            dataIsEmpty = Ext.isEmpty(value);
        });
        var request = {
            url: url,
            method: method,
            async: false,
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                var data = responseMessage.data;
                if(responseMessage.success){
                    Ext.Array.each(me.items.items,function(item){
                        item.setValue(data[item.name]);
                    })
                }else{
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (resp) {
                if(!Ext.isEmpty(data)) {
                    try {
                        var responseMessage = Ext.JSON.decode(resp.responseText);
                    } catch(e) {
                        //Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('illlegal json'));
                        mask.hide();// error in the above string (in this case, yes)!
                        return;
                    }
                }
                mask.hide();
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        };
        if(!dataIsEmpty){
            Ext.Ajax.request(request);
        }
    }
});