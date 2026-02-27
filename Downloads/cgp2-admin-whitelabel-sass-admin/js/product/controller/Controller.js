Ext.define('CGP.product.controller.Controller',{
    /**
     *在body展开时 显示rule的grid
     */




    expandBody: function (rowNode, record, expandRow) {
        var me= this;
        var id = record.get('id');
        var gridId = 'producedays-template-rule-grid-' + id;
        var containerId = 'produceDays-template-rule-content-' + id;

        //    if (!Ext.getCmp(gridId)) {
        if (Ext.getCmp(gridId))
            Ext.getCmp(gridId).destroy();

        me.generateRuleGrid(record, gridId, containerId);



    },

    generateRuleGrid: function (record, gridId, containerId) {
        var me = this;

        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1,
            listeners: {
                edit: function (editor, e) {
                    e.record.commit();
                }
            }
        });

        var numberEditorConfig = {
            xtype: 'numberfield',
            allowBlnk: false,
            hideTrigger: true,
            allowExponential: false,
            decimalPrecision: 1
        }
        var grid = new Ext.grid.Panel({
            id: gridId,
            recordId: record.get('id'),
            renderTo: Ext.get(containerId),
            width: 800,
            height: 300,
            plugins: [cellEditing],
            store: _generateRuleStore(record),
            columns: [
                {
                    dataIndex: 'qtyFrom',
                    text: i18n.getKey('qtyFrom')
                },
                {
                    dataIndex: 'qtyTo',
                    text: i18n.getKey('qtyTo')
                },
                {
                    dataIndex: 'minDays',
                    text: i18n.getKey('minDays')
                },
                {
                    dataIndex: 'maxDays',
                    text: i18n.getKey('maxDays'),
                    editor: numberEditorConfig
                },
                {
                    dataIndex: 'sortOrder',
                    text: i18n.getKey('sortOrder')
                }
            ]
        });

        function _generateRuleStore(record) {

            var ruleStore =
                new Ext.data.Store({
                    idProperty: 'id',
                    fields: [

                        {
                            name: 'id',
                            type: 'int',
                            useNull: true
                        },
                        {
                            name: 'qtyFrom',
                            type: 'int'
                        },
                        {
                            name: 'qtyTo',
                            type: 'int'
                        },
                        {
                            name: 'minDays',
                            type: 'int'
                        },
                        {
                            name: 'maxDays',
                            type: 'int'
                        },
                        {
                            name: 'sortOrder',
                            type: 'int'
                        }
                    ],
                    data: _generateRuleId(record.get('id'), record.get('rules'))
                });

            /**
             * 根据输入的rule顺序生成id
             */
            function _generateRuleId(id, rules) {
                var data = [];

                Ext.Array.each(rules, function (rule, index) {

                    var d = Ext.clone(rule);

                    //d.id = index;

                    data.push(d);

                });

                return data;
            }

            return ruleStore;

        }

    },
    afterPageLoad: function (p) {
        var me = this;
        //在重新加载页面前关闭掉expander
        var store = p.grid.getStore();
        store.on('beforeload', function () {
            me.collapseAllBody(p.grid);
        });
    },
    collapseAllBody: function (grid) {
        var store = grid.getStore();
        var expander = grid.plugins[0];

        for (var i = 0; i < store.getCount(); i++) {
            var record = store.getAt(i);
            if (expander.recordsExpanded[record.internalId]) {
                expander.toggleRow(i, record);
            }
        }
    },
    showProduceDaysTpl: function(productId,store,filterId){
        Ext.create('CGP.product.view.producedaystpl.AllProduceDaysTplWin',{
            productId: productId,
            store: store,
            filterId: filterId
        }).show();
    },
    modifyProductProduceDaystpl: function(allProduceDaysTplWin,ProduceDaystplId){
        Ext.MessageBox.confirm('提示', '是否选择此模板作为产品生产日期模板?', callBack);
        function callBack(id) {
            //var selected = me.getSelectionModel().getSelection();
            if (id === "yes") {
                var requestConfig = {
                    url: adminPath + 'api/products/'+allProduceDaysTplWin.productId+'/produceDaysTemplate?templateId='+ProduceDaystplId,
                    method: 'PUT',
                    headers: {Authorization: 'Bearer '+Ext.util.Cookies.get('token')},
                    success: function(resp){
                        var response = Ext.JSON.decode(resp.responseText);
                        if(!response.success){
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            return;
                        }
                        allProduceDaysTplWin.store.load();
                        allProduceDaysTplWin.close();
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                }
                Ext.Ajax.request(requestConfig);
                //store.sync();
            }else{
                close();
            }
        }
    },
    producePage: function(pageId,window,pageName){
        var me = this;
        var pageList = [];
        var createData = {};
        createData.pageId = pageId;
        createData.productId = window.productId;
        pageList.push(createData);
        var jsonData = {'websiteId': window.website, 'pageList': pageList};
        var myMask = new Ext.LoadMask(window, {msg: "请稍等,正在生成页面...)"});
        myMask.show();
        var requestConfig = {
            url: adminPath + 'api/admin/cmsPage/generateHtmls',
            jsonData: jsonData,
            method: 'POST',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                if (myMask != undefined) {
                    myMask.hide();
                }
                var responseMessage = Ext.JSON.decode(response.responseText);
                var messageList = [];
                var pageDataList = null;
                if (!Ext.isEmpty(responseMessage.data)) {
                    me.createResponseDataWin(responseMessage.data,window.record,pageName,pageList)
                } else {
                    Ext.Msg.alert('提示', '生成页面失败！失败信息：' + responseMessage.message);
                }
            },
            failure: function (response) {
                if (myMask != undefined) {
                    myMask.hide();
                }
                if (response.status == 401) {
                    Ext.Msg.alert('当前请求需要用户验证!');
                } else if (response.status == 404) {
                    Ext.Msg.alert('未找到请求资源!');
                } else if (response.status == 408) {
                    Ext.Msg.alert('请求超时!');
                } else {
                    Ext.Msg.alert('发送请求失败！' + response.status);
                }
                console.log(response);
            }

        }
        if (!Ext.isEmpty(pageId)) {
            Ext.Ajax.request(requestConfig);

        } else {
            if (myMask != undefined) {
                myMask.hide();
            }
            Ext.Msg.alert('提示', pageName + ':生成页面失败,请选择产品！');
        }
    },
    /**
     * 显示生成页面时响应信息的窗口
     * @param {Object} data 响应的信息
     * @param {Model} record product类型页面选择的产品信息
     * @param {String} pageName 单选生成product类型页面的名字
     * @param {Array} pageList 批量生成时，所选的页面集合
     */
    createResponseDataWin: function(data,record,pageName,pageList){
        var me = this;
        Ext.create('CGP.product.view.producepage.ResponseDataWin',{
            data: data,
            record: record,
            pageName: pageName,
            pageList: pageList,
            controller: me
        })
    },
    importProduct: function(){
        var me = this;

        Ext.create('Ext.window.Window',{
            title: i18n.getKey('importProduct'),
            width: 500,
            height: 150,
            layout: 'fit',
            modal: true,
            items:[{
                xtype: 'form',
                border: false,
                padding: '10px',
                items: [{
                    xtype: 'filefield',
                    name: 'file',
                    width: 400,
                    allowBlank: false,
                    itemId: 'file',
                    fieldLabel: i18n.getKey('file')
                }]
            }],
            bbar: ['->',{
                xtype: 'button',
                text: i18n.getKey('import'),
                handler: function(){
                    var win = this.ownerCt.ownerCt;
                    var form = win.down('form');
                    if(form.isValid()){
                        var lm = win.setLoading();
                        form.submit({
                            url: adminPath + 'api/products/import?access_token=' + Ext.util.Cookies.get('token'),
                            method: 'POST',
                            success: function (res, action) {
                                //page.form.insert(3,image);
                                lm.hide();
                                var response = action.response;
                                if(response.success){
                                    Ext.Msg.alert('提示','导入成功',function close(){
                                        win.close();
                                    })
                                }else{
                                    Ext.Msg.alert('提示','错误信息'+response.message);
                                }
                            },
                            failure: function (form, action) {
                                lm.hide();
                               Ext.Msg.alert('提示','请求服务器失败！');
                            }
                        });
                    }
                }
            },{
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function(){
                    this.ownerCt.ownerCt.close();
                }
            }]
        }).show();
    },
    exportProduct: function(data){
        if(Ext.isEmpty(data)){
            Ext.Msg.alert('提示','请选择产品！');
        }else{
            var params;
            for(var i = 0; i<data.length; i++){
                if(i == 0){
                    params = 'ids='+data[i].get('id');
                }else{
                    params= params+'&ids='+data[i].get('id');
                }
            }
            window.open(adminPath + 'api/products/export?'+params+'&access_token=' + Ext.util.Cookies.get('token'));}
    },
    copyProductPriceRule: function(srcId,destId,win){
        Ext.Msg.show({
            title: '提示',
            msg: '是否覆盖原价格规则？(否：在原价格规则上添加！)',
            width: 300,
            buttons: 13,
            fn: callback,
            multiline: false,
            animateTarget: 'addAddressBtn'
        });
        function callback(id){
            if(id === 'ok') {
                Ext.Ajax.request({
                    url: adminPath + 'api/products/'+srcId+'/quantityPrice/to/'+destId,
                    method: 'POST',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function(resp){
                        var response = Ext.JSON.decode(resp.responseText);
                        if(!response.success){
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            return;
                        }
                        var priceRuleStore = win.priceRuleStore;
                        priceRuleStore.productId = destId;
                        priceRuleStore.load();
                        win.close();
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }

                })
            }else if(id === 'no'){
                Ext.Ajax.request({
                    url: adminPath + 'api/products/'+srcId+'/quantityPrice/to/'+destId+'?append=true',
                    method: 'POST',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function(resp){
                        var response = Ext.JSON.decode(resp.responseText);
                        if(!response.success){
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            return;
                        }
                        window.priceRuleStore.load();
                        window.close();
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }

                })
            }
        }

    },
    modifyProductMode: function(productId){
        Ext.create('CGP.product.view.modifyproductmode.ModifyProductMode',{
            configurableId: productId
        }).show();
    },

    productManage: function(record){

        // Ext.create('Ext.ux.window.SuperWindow', {
        //     width: 900,
        //     height: 500,
        //     bodyPadding: 0,
        //     title: i18n.getKey('product') + i18n.getKey('manager'),
        //     isView: true,
        //     items: [
        //         Ext.create('CGP.product.view.procductManage.view.Main',{
        //             id:"tabProcductManage",
        //             productId: record.get('id'),
        //             record:record
        //         })
        //     ]
        // }).show();
    },

    getProductManagers: function (record) {
        var method = 'GET',
            url = adminPath + 'api/productAdministratorConfigs?productId=' + record.get('id');
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            async: false,
            jsonData: null,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    Ext.create('Ext.ux.window.SuperWindow', {
                        width: 900,
                        height: 500,
                        bodyPadding: 0,
                        title: i18n.getKey('product') + i18n.getKey('manager'),
                        isView: true,
                        items: [
                            Ext.create('CGP.product.view.procductManage.view.Main',{
                                id:"tabProcductManage",
                                productId: record.get('id'),
                                record:record,
                                productManagerData:resp.data
                            })
                        ]
                    }).show();
                    // productManagerTab.setValue(resp.data);
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('dataFailure') + resp.data.message,)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('requestFailed') + object.data.message);
            },
            callback: function () {

            }
        });
    },
})