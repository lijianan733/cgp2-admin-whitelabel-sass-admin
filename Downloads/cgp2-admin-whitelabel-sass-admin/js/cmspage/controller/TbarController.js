/**
 * cmspage主页面增加按钮的控制器
 */
Ext.define('CGP.cmspage.controller.TbarController',{

    constructor: function () {

        this.callParent(arguments);
    },
    /**
     * 为Cmspage主页面增加批量生产和发布页面两个按钮
     * @param {Ext.ux.ui.GridPage} page 主页面的gird
     */
    addBatchcreateBtn: function (page,cmspageStore) {
        var me = this;
        var website = Ext.create("CGP.cmspage.store.Website");
        var batchProduceButton = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('batchProduce'),
            width: 90,
            iconCls: 'icon_audit',
            handler: function () {
                var data = Ext.getCmp("gridPageId").getSelectionModel().getSelection();
                var websiteEqual;
                for(var i = 0;i<data.length-1;i++){
                    for(var j = i+1;j<data.length;j++){
                        if(data[i].get('websiteId') == data[j].get('websiteId')){
                            websiteEqual = true;
                        }else{
                            websiteEqual = false;
                            break;
                        }
                    }
                    break;

                }
                if(websiteEqual == true || data.length == 1){
                    me.showBatchSelectPageWin(data,website,cmspageStore);
                }else{
                    Ext.Msg.alert('提示','请选择CMS页面(相同网站)!');
                }
            }
        });
        var issuePage = Ext.widget({
            xtype: 'toolbar',
            layout: 'column',
            style: 'padding:0',
            border: false,
            width: 100,
            items: [
                {
                    text: i18n.getKey('issuePage'),
                    width: '100%',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                text: i18n.getKey('issueAppointWebPage'),
                                disabledCls: 'menu-item-display-none',
                                handler: function () {
                                    me.createIssueAppointWebPageWin(cmspageStore);
                                }
                            }/*,
                            {
                                text: i18n.getKey('issueAllPage'),
                                disabledCls: 'menu-item-display-none',
                                handler: function () {
                                    Ext.MessageBox.confirm('提示', '需生成的页面较多，等待时间较长，是否继续生成？', callBack);
                                    function callBack(id) {
                                        //var selected = me.getSelectionModel().getSelection();
                                        if (id === "yes") {
                                            me.issueAllPage();
                                        }else{
                                            close();
                                        }
                                    }
                                }
                            }*/
                        ]
                    }
                }
            ]

        });
        var copyStaticFile = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('copyStaticFile'),
            width: 90,
            handler: function () {
                Ext.create('CGP.cmspage.view.CopyStaticFile').show();
            }
        });
        var uploadFile = Ext.widget({
            xtype: 'button',
            text: i18n.getKey('uploadStaticResource'),
            width: 90,
            handler: function(){
                Ext.create('CGP.cmspage.view.UploadFileWin').show();
            }
        })
        page.toolbar.add(batchProduceButton);
        page.toolbar.add(issuePage);
        /*page.toolbar.add(copyStaticFile);
        page.toolbar.add(uploadFile);*/
    },
    /**
     * 显示批量生成所选择的页面
     * @param {Array} data 选择的页面的数据集合
     * @param {CGP.cmspage.store.Website} websiteStore 网站的store
     */
    showBatchSelectPageWin: function(data,websiteStore,cmspageStore){
        var me = this;
        Ext.create('CGP.cmspage.view.SelectedPageWin',{
            data: data,
            tbarController: me,
            website: websiteStore,
            cmspageStore: cmspageStore
        })
    },
    /**
     * 批量生成时为产品页面选择产品的窗口
     * @param {Number} websiteId 网站ID
     * @param {Number} pageId 页面ID
     * @param {String} pageName 页面名称
     * @param {Ext.util.MixedCollection} collection 记录产品类型页面选择产品ID的集合
     */
    showBatchCreateSelectProductWin: function(websiteId, pageId, pageName,collection){
        var me = this;
        Ext.create('CGP.cmspage.view.BatchCreateSelectProductWin',{
            websiteId: websiteId,
            pageId: pageId,
            pageName: pageName,
            collection: collection,
            tbarController: me

        })
    },
    /**
     * 实现批量生成页面
     * @param {CGP.cmspage.view.SelectedPageWin} selectedPageWin 显示已选择的cms页面的窗口
     */
    batchCreatePage: function(selectedPageWin){
        var allArray = [];
        var productPageIds = [];
        var controller = Ext.create('CGP.cmspage.controller.Controller');
        for (var i = 0; i < selectedPageWin.data.length; i++) {
            if (selectedPageWin.data[i].get('type') == 'normal') {
                allArray.push({'pageId': selectedPageWin.data[i].get('id')});
            } else {
                productPageIds.push(selectedPageWin.data[i].get('id'));
                allArray = Ext.Array.merge(allArray, selectedPageWin.pageDataList[selectedPageWin.data[i].get('id')]);
            }
        }
        var jsonData = {'websiteId': selectedPageWin.data[0].get('websiteId'), 'pageList': allArray};
        //var pageName = null;
        var requestConfig = {
            url: adminPath + 'api/cmsPages/generateHtmls',
            jsonData: jsonData,
            method: 'POST',
            timeout: 1800000,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                if (myMask != undefined) {
                    myMask.hide();
                }
                var responseMessage = Ext.JSON.decode(response.responseText);
                var messageList = [];
                var pageName = null;
                if(Ext.isEmpty(responseMessage.data)){
                    Ext.Msg.alert('提示','生成页面失败！失败信息：'+responseMessage.message);
                }else{
                    controller.createResponseDataWin(responseMessage.data,selectedPageWin.selectProductList,pageName,selectedPageWin.data,selectedPageWin.cmspageStore);
                }
            },
            failure:function(response){
                if (myMask != undefined) {
                    myMask.hide();
                }
                if(response.status == 401){
                    Ext.Msg.alert('提示','当前请求需要用户验证!');
                }else if(response.status == 404){
                    Ext.Msg.alert('提示','未找到请求资源!');
                }else if(response.status == 408){
                    Ext.Msg.alert('提示','请求超时!');
                }else{
                    Ext.Msg.alert('提示','发送请求失败！'+response.status);
                }
                console.log(response);
                //Ext.Msg.alert('提示','发送请求失败！');
            }

        }
        if(!Ext.isEmpty(productPageIds)){
            //未选择产品的产品类型页面Id集合
            var noSelectProductPageId = [];
            Ext.Array.each(productPageIds,function(productPageId){
                if(selectedPageWin.pageDataList[productPageId] == null){
                    noSelectProductPageId.push(productPageId)
                }
            })
            if(Ext.isEmpty(noSelectProductPageId)){
                var myMask = new Ext.LoadMask(selectedPageWin, {msg: "请稍等,正在生成页面...<br>(需生成页面较多时，等待时间较长！)"});
                myMask.show();
                Ext.Ajax.request(requestConfig);
            }else{
                Ext.Msg.alert('提示','编号为：'+noSelectProductPageId+'的产品页面未选择产品！');
            }
        }else{
            var myMask = new Ext.LoadMask(selectedPageWin, {msg: "请稍等,正在生成页面...<br>(需生成页面较多时，等待时间较长！)"});
            myMask.show();
            Ext.Ajax.request(requestConfig);
        }
    },
    /**
     * 创建发布指定网站的页面的窗口
     */
    createIssueAppointWebPageWin: function(cmspageStore){
        var me = this;
        Ext.create('CGP.cmspage.view.IssueAppointWebPageWin',{
            tbarController: me,
            cmspageStore: cmspageStore
        });
    },
    /**
     * 发布指定网站的页面
     * @param {CGP.cmspage.view.IssueAppointWebPageWin} issueAppointWebPageWin 发布指定网站的页面的窗口
     * @param {Number} websiteId 指定网站的ID
     */
    issueAppointWebPage: function(data,window){
        var controller = Ext.create('CGP.cmspage.controller.Controller');
        var myMask = new Ext.LoadMask(window, {msg: "生成页面较多，需要较长时间！请耐心等待。"});
        var publishId ;
        Ext.Object.each(data['publishStrategy'],function(key,value){
            publishId=value.value;
        })
        myMask.show();
        //websiteWin.close();
            Ext.Ajax.request({
                url: adminPath + 'api/cmsPages/'+data['websiteId']+'/generateHtmls?exportDir='+data['exportDir']+'&publishId='+publishId,
                method: 'POST',
                timeout: 1800000,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    if (myMask != undefined) {
                        myMask.hide();
                    }
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    var selectProductData = null;
                    var pageName = null;
                    var pageList = null;
                    if(responseMessage.success == true){
                        controller.createResponseDataWin(responseMessage.data,selectProductData,pageName,pageList,window.cmspageStore);
                    }else{
                        Ext.Msg.alert('提示','生成失败！失败信息：'+responseMessage.message);
                    }
                    /*Ext.Msg.alert('提示','发布'+website.getById(websiteId).get('name')+'网站页面成功！',function close(){
                     websiteWin.close();
                     });*/
                },
                failure:function(response){
                    if (myMask != undefined) {
                        myMask.hide();
                    }
                    if(response.status == 401){
                        Ext.Msg.alert('提示','当前请求需要用户验证!');
                    }else if(response.status == 404){
                        Ext.Msg.alert('提示','未找到请求资源!');
                    }else if(response.status == 408){
                        Ext.Msg.alert('提示','请求超时!');
                    }else{
                        Ext.Msg.alert('提示','发送请求失败！'+response.status);
                    }
                    console.log(response);
                    //Ext.Msg.alert('提示','发送请求失败！');
                }
            })

    },
    /**
     * 发布所有页面
     */
    issueAllPage: function(){
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "生成页面较多，需要较长时间！请耐心等待。"});
        myMask.show();
        Ext.Ajax.request({
            url: adminPath + 'api/cmsPages/generateAllHtmls',
            method: 'POST',
            timeout: 1000000,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                if (myMask != undefined) {
                    myMask.hide();
                }
                var responseMessage = Ext.JSON.decode(response.responseText);
                if(responseMessage.success == true){
                    me.createMessage.createMessageWin(responseMessage.data)
                }else{
                    Ext.Msg.alert('提示','生成失败！失败信息：'+responseMessage.data.message);
                }
            },
            failure:function(response){
                if (myMask != undefined) {
                    myMask.hide();
                }
                if(response.status == 401){
                    Ext.Msg.alert('提示','当前请求需要用户验证!');
                }else if(response.status == 404){
                    Ext.Msg.alert('提示','未找到请求资源!');
                }else if(response.status == 408){
                    Ext.Msg.alert('提示','请求超时!');
                }else{
                    Ext.Msg.alert('提示','发送请求失败！'+response.status);
                }
                console.log(response);
                //Ext.Msg.alert('提示','发送请求失败！');
            }
        });
    },
    copyStaticFile: function(data,window){
        var lm = window.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/admin/cmsPage/static/copy',
            jsonData: {"websiteId":data.websiteId,"exportDir":data.copyExportDir},
            method: 'POST',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function(res){
                lm.hide();
                if(res.responseText == 'success'){
                    Ext.Msg.alert('提示','拷贝成功！',function close(){
                        window.close();
                    })
                }else{
                    Ext.Msg.alert('提示','拷贝失败，请重试！');
                }
            },
            failure: function(){
                lm.hide();
                Ext.Msg.alert('提示','请求服务器失败！');
            }
        })
    }

})