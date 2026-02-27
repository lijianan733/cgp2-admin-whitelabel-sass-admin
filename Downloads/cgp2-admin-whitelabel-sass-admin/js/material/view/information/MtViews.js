Ext.define("CGP.material.view.information.MtViews", {
    extend: "Ext.grid.Panel",
    itemId: 'mtViews',
    defaults: {
        width: 150
    },

    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('materialViewType');
        var controller = Ext.create('CGP.material.controller.Controller');
        me.store = Ext.create("CGP.material.store.LocalMaterialViewType", {
            data: []
        });
        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                width: 70,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('remove'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.getStore();
                            Ext.Msg.confirm('提示', '确定删除？', callback);
                            function callback(id) {
                                if(id === 'yes'){
                                    store.removeAt(rowIndex);
                                }
                            }
                        }
                    }
                ]
            },
            {
                dataIndex: '_id',
                text: i18n.getKey('id'),
                width: 150,
                itemId: 'id'
            },
            {
                dataIndex: 'name',
                text: i18n.getKey('name'),
                width: 200,
                itemId: 'name'
            },
            {
                dataIndex: 'designType',
                text: i18n.getKey('designType'),
                width: 200,
                itemId: 'designType',
                renderer: function(value){
                    if(!Ext.isEmpty(value)){
                        return value['name'];
                    }
                }
            },
            {
                dataIndex: 'preDesignObject',
                text: i18n.getKey('preDesignObject'),
                width: 200,
                itemId: 'preDesignObject',
                renderer: function(value){
                    if(!Ext.isEmpty(value)){
                        return value['name'];
                    }
                }
            },
            {
                dataIndex: 'sequenceNumber',
                text: i18n.getKey('sequenceNumber'),
                width: 70,
                itemId: 'sequenceNumber'
            },
            {
                dataIndex: 'pageContentStrategy',
                text: i18n.getKey('pageContentStrategy'),
                width: 200,
                itemId: 'pageContentStrategy'
            },
            {
                dataIndex: 'pageContentFetchStrategy',
                text: i18n.getKey('pageContentFetchStrategy'),
                width: 200,
                itemId: 'pageContentFetchStrategy'
            },
            {
                dataIndex: 'pageContentQuantity',
                text: i18n.getKey('pageContentQuantity'),
                width: 70,
                itemId: 'pageContentQuantity'
            },
            {
                dataIndex: 'viewQuantity',
                text: i18n.getKey('viewQuantity'),
                width: 70,
                itemId: 'viewQuantity'
            },{
                dataIndex: 'pageContentSchemaId',
                text: i18n.getKey('pageContentSchemaId'),
                width: 200,
                itemId: 'pageContentSchemaId'
            }
        ];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add')+'ViewType',
                handler: function () {
                    var grid = this.ownerCt.ownerCt;
                    var editOrNew = 'add';
                    var filterData = grid.getStore().data.items;
                    controller.addMtViews(grid.getStore(),filterData);
                }
            }
        ];
        me.callParent(arguments);
        me.content = me;
    },
    getValue: function () {
        var me = this;
        var dataArray = [];
        var dataObject = {};
        me.store.data.items.forEach(function (item) {
            var data = item.data;
            dataArray.push({
                _id: data._id,
                idReference: 'MaterialViewType',
                clazz: domainObj['MaterialViewType']
            });

        });
        dataObject = dataArray;
        return dataObject;
    },

    refreshData: function (data) {

        var me = this;
        var store = me.getStore();
        var materialVT = Ext.create('CGP.material.store.MaterialViewType');

        store.removeAll();
        if(data.defaultViewTypes){
            var viewTypes = data.defaultViewTypes;
            var dataArray = [];
            var itemLength = viewTypes.length;
            if(itemLength > 0){
                for(var i=0;i<itemLength;i++){

                    (function(j){
                        Ext.Ajax.request({
                            url: adminPath + 'api/materialViewTypes/' + viewTypes[j]['_id'],
                            method: 'GET',
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (res) {
                                var responseMessage = Ext.JSON.decode(res.responseText);
                                var data = responseMessage.data;
                                if (responseMessage.success) {
                                    dataArray.push(data);
                                    if(j == itemLength-1){
                                        store.add(dataArray);
                                    }
                                } else {

                                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message)
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        });

                    })(i);
                }
            }

            /*materialVT.on('load',function(){
                Ext.Array.each(viewTypes,function(viewTypeID){

                    dataArray.push(materialVT.getById(viewTypeID))
                });
                store.add(dataArray);
            });*/
        }

    }

});