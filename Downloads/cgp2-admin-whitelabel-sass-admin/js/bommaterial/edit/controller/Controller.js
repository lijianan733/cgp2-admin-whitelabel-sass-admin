Ext.define("CGP.bommaterial.edit.controller.Controller", {
    data: null,
    page: null,
    bomPanel: null,
    statics:{
        parentMaterialId : null
    },
    /**
     * 编辑新建记录时初始化页面的执行函数
     * @param {Ext.container.Viewpor}page
     * @param {Object} data 该物料的信息
     */
    initPanel: function (page, data) {
        var me = this;
        me.data = data || new Object();
        me.page = page;
        if (Ext.isEmpty(data)) {
            var createInitPanel = Ext.create("CGP.bommaterial.view.SelectAttributeSet", {
                controller: me
            });
            me.page.add(createInitPanel);
        } else {
            var bomMaterialTab = me.createBomMaterialPanel(data);
            bomMaterialTab.setValue(me.data);
            me.page.add(bomMaterialTab.content);
        }
    },
    /**
     * 新建时选择了默认属性集的时候添加编辑物料的tab
     * @param {Ext.form.Panel} form
     */
    createBomMaterialNextStep: function (form) {
        var me = this;
        me.data.attributeSetId = form.getComponent('BomAttributeSets').getValue();
        var bomMaterialTab = me.createBomMaterialPanel(me.data);
        me.page.removeAll();
        me.page.add(bomMaterialTab.content);

    },
    /**
     * 创建编辑物料的tab
     * @param {Object} data 物料信息
     * @returns {CGP.bommaterial.edit.EditTab} 编辑物料的tab
     */
    createBomMaterialPanel: function (data) {
        var me = this;
        var information = Ext.create("CGP.bommaterial.edit.module.Information", me.data);
        var customerAttribute = Ext.create("CGP.bommaterial.edit.module.customerattribute.CustomerAttribute", {
            data: me.data,
            controller: me
        });
        me.bomPanel = me.showBomPanel(me.data);
        var bomMaterialTab = Ext.create('CGP.bommaterial.edit.EditTab', {
            information: information,
            customerAttribute: customerAttribute,
            bomPanel: me.bomPanel,
            controller: me,
            data: data
        });
        return bomMaterialTab;
    },
    /**
     * 保存物料信息
     * @param {Component} bomMaterialTab 编辑物料的tab
     */
    saveBomMaterial: function (bomMaterialTab) {
        var me = this;
        var information = bomMaterialTab.information;
        var data = bomMaterialTab.data || {};
        var info = information.getValue();
        var customerAttribute = bomMaterialTab.customerAttribute;
        data = Ext.merge(data, info);
        data.customAttributes = customerAttribute.getValue();
        var bomMaterial = Ext.create('CGP.bommaterial.model.MaterialModel', data);

        //保存物料
        bomMaterial.save({
            callback: function (records, operation, success) {
                if (success) {
                    Ext.Msg.alert('提示', '保存成功!');
                    var responseData = Ext.JSON.decode(operation.response.responseText).data;
                    bomMaterialTab.controller.data = responseData;
                    information.content.getComponent('id').setValue(responseData.id);
                    me.data.id = responseData.id;
                    CGP.bommaterial.edit.controller.Controller.parentMaterialId = responseData.id;
                    information.content.setValue(responseData);
                    //me.bomPanel.initItems();
                } else {
                    Ext.Msg.alert('提示', '保存失败,错误信息：' + operation.error);
                }
            }
        });
        console.log(bomMaterial);
    },
    /**
     * 复制物料信息
     * @param {Component} bomMaterialTab 编辑物料的tab
     */
    copyBomMaterial: function(data){
        var me = this;
        delete data.id;
        delete data.code;
        me.data = data || new Object();
        var bomMaterialTab = me.createBomMaterialPanel(data);
        me.page.removeAll();
        me.page.add(bomMaterialTab.content);
    },
    /**
     * 添加修改自定义属性编辑窗口
     * @param {Ext.data.Store} store 自定义属性的Store
     * @param {Model} record 该自定义属性信息
     */
    customerAttriWin: function (store, record,editOrNew) {
        Ext.create("CGP.bommaterial.edit.module.customerattribute.EditCustomAttriWin", {
            store: store,
            record: record,
            editOrNew: editOrNew
        }).show();
    },
    /**
     * 添加修改自定义属性的option窗口
     * @param {Ext.grid.Panel} grid options的显示列表
     * @param {Ext.data.Model} record
     * @param createOrEdit
     */
    openOptionWindow: function (grid, record, createOrEdit,valueType) {
        var record = record;
        if (createOrEdit == 'create') {
            record = Ext.create("CGP.bommaterial.model.AttributeOption", {
                id: null,
                name: '',
                sortOrder: ''
            })
        }
        Ext.create("CGP.bommaterial.edit.module.customerattribute.AddOption", {
            grid: grid,
            record: record,
            createOrEdit: createOrEdit,
            valueType: valueType
        }).show();
    },
    /**
     * 创建编辑tab的BOM界面
     * @param {Ext.data.Model} data 物料信息
     * @returns {Object}
     */
    showBomPanel: function (data) {
        var me = this;
        var bomPanel = {};
        var children = null;
        var bomTreePanel;
        if (!Ext.isEmpty(me.data.id)) {
            Ext.Ajax.request({
                url: adminPath + 'api/admin/bom/schema/materials/' + me.data.id + '/children',
                method: 'GET',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var responseMessage = Ext.JSON.decode(res.responseText);
                    children = responseMessage.data;
                    Ext.Array.each(children, function (item) {
                        if(item.itemMaterial.childrenSize == 0){
                            item.leaf = true
                        }else{
                            item.leaf = false
                        }
                        item.editable = true,
                        item.nodeId = me.generateUUID();
                    });
                    bomTreePanel = Ext.create("CGP.bommaterial.edit.module.bom.BomTreePanel", {
                        controller: me,
                        itemId: 'bomTreePanel',
                        parentMaterialId: me.data.id,
                        children: children
                    });
                }
            });
        }
        else {
            bomTreePanel = Ext.create("CGP.bommaterial.edit.module.bom.BomTreePanel", {
                controller: me,
                itemId: 'bomTreePanel',
                parentMaterialId: me.data.id
            });
        }

        var bomInfoPanel = Ext.create("Ext.panel.Panel",{
            region: 'center',
            title: i18n.getKey('bomInformation'),
            itemId: 'bomInfoPanel',
            layout: 'fit'
        });
        bomPanel.content = Ext.create("Ext.panel.Panel", {
            layout: 'border',
            title: 'BOM',
            defaults: {
                split: true,
                hideCollapseTool : true
            },
            listeners: {

                beforerender: function (panel) {
                    //如果尚未保存
                    if (Ext.isEmpty(me.data.id)) {

                        Ext.Msg.alert('提示', '请先保存物料!');
                        return false;
                    } else {
                        panel.add([bomTreePanel, bomInfoPanel]);
                    }
                }

            }
        });
        return bomPanel;
    },
    /**
     * 展示Bom结构
     * @param {Ext.tree.Panel} treePanel显示bom结构的panel
     */
    showMaterialItems: function (treePanel,node) {
        var me = this;
        function addBomMaterialItem() {
            var targetNode;
            targetNode = node;
            if(Ext.isEmpty(node)){
                targetNode = treePanel.getSelectionModel().getSelection()[0];
            }
            //targetNode.set('leaf', false);
            targetNode.set('expanded', true);
            bomMaterialItem(targetNode, treePanel);
        };
        addBomMaterialItem();
        function bomMaterialItem(parentNode, tree) {
            
            if(parentNode.data.parentId ==='root'){
                parentNode.data.path = parentNode.data.parentMaterialId;
            }else{
                parentNode.data.path='';
            }
            parentNode.data.path += (parentNode.parentNode.data.path || '')+':'+parentNode.data.id+','+parentNode.data.itemMaterial.id;
            
            if (Ext.isEmpty(parentNode.childNodes)) {
                var materialId = parentNode.data.itemMaterial.id;
                Ext.Ajax.request({
                    url: adminPath + 'api/admin/bom/schema/materials/' + materialId + '/children',
                    method: 'GET',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (res) {
                        var responseMessage = Ext.JSON.decode(res.responseText);
                        var children = responseMessage.data;
                        if (!Ext.isEmpty(children)) {
                            Ext.Array.each(children, function (item) {
                                if(item.itemMaterial.childrenSize == 0){
                                    item.leaf = true
                                }else{
                                    item.leaf = false
                                }
                                item.nodeId = me.generateUUID();
                            });
                            parentNode.appendChild(children);
                        }
                    }
                });
            }
        }
    },
    /**
     * 添加子物料Bom的窗口
     * @param {Number} parentMaterialId 父物料Id
     * @param {Ext.tree.Panel} tree 显示bom结构的panel
     */
    addChildMaterialWin: function (parentMaterialId, tree) {
        Ext.create('CGP.bommaterial.edit.module.bom.AddChildMaterial', {
            parentMaterialId: parentMaterialId,
            tree: tree
        }).show();
    },
    /**
     * 添加子物料Bom结构
     * @param {Ext.form.Panel} form 添加时的表单
     * @param {Ext.tree.Panel} tree 显示bom结构的panel
     * @param {Ext.window.Window} window 添加子物料bom的显示窗口
     */
    addChildMaterial: function (form, tree, window) {
        var me = this;
        var data = form.getValues();
        data.itemMaterial = form.getComponent('itemMaterial').getValue();
        data.itemMaterial = data.itemMaterial[Object.keys(data.itemMaterial)];
        var selectableMaterialsArr = []
        if(data.selectableMaterials){
            data.selectableMaterials = form.getComponent('selectableMaterials').getValue();
            Ext.Object.each(data.selectableMaterials,function(key,value,item){
                selectableMaterialsArr.push(value);
            })
            data.selectableMaterials = selectableMaterialsArr;
        }
        data.parentMaterialId = parseInt(data.parentMaterialId);
        Ext.Ajax.request({
            url: adminPath + 'api/admin/bom/schema/bomItems',
            method: 'POST',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            jsonData: data,
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var children = responseMessage.data;
                if (responseMessage.success == true) {
                    if (!Ext.isEmpty(children)) {
                        var parentNode = tree.getRootNode();
                        Ext.Array.each(children, function (item) {
                            if(item.itemMaterial.childrenSize == 0){
                                item.leaf = true
                            }else{
                                item.leaf = false
                            }
                            children.editable = true;
                            item.nodeId = me.generateUUID();
                        });
                        parentNode.appendChild(children);
                        window.close();
                    }
                } else {
                    Ext.Msg.alert("提示", "请求错误:" + responseMessage.message);
                }
                ;
            },
            failure: function () {
                Ext.Msg.alert("提示", "请求服务器错误！");
            }

        });
    },
    /**
     * 获取UUID作为treeStore的每个节点的唯一ID
     * @returns {string}
     */
    generateUUID: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    },
    /**
     * 显示bom结构的详细信息
     * @param {Ext.tree.Panel} view 显示bom结构的panel
     * @param {Ext.data.Model} record 需要显示的BomItem信息
     * @param item
     * @param index
     * @param e
     * @param eOpts
     */
    showBomMaterialInfo: function(view, record){
        var me = this;
        var bomInfoPanel= view.ownerCt.getComponent('bomInfoPanel');
        bomInfoPanel.removeAll();
        var bomInfoFormPanel = Ext.create('CGP.bommaterial.edit.module.bom.BomInfoPanel',{
            record: record,
            tree: view,
            itemId: 'bomInfoFormPanel',
            controller: me
        });
        bomInfoPanel.add(bomInfoFormPanel);
        bomInfoFormPanel.loadRecord(record);
    },
    /**
     * 修改bomItem详细信息
     * @param {Ext.form.Panel} form 修改时提交的表单信息
     * @param {Ext.tree.Panel} tree 显示bom结构的panel
     */
    modifyBomItem: function(form,tree){
        var me = this;
        var data = form.getValues();
        data.itemMaterial = form.getComponent('itemMaterial').getValue();
        data.itemMaterial = data.itemMaterial[Object.keys(data.itemMaterial)];
        var selectableMaterialsArr = []
        if(data.selectableMaterials){
            data.selectableMaterials = form.getComponent('selectableMaterials').getValue();
            Ext.Object.each(data.selectableMaterials,function(key,value,item){
                selectableMaterialsArr.push(value);
            })
            data.selectableMaterials = selectableMaterialsArr;
        }
        Ext.Ajax.request({
            url: adminPath + 'api/admin/bom/schema/bomItems/'+data.id,
            method: 'PUT',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            jsonData: data,
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var children = responseMessage.data;
                if (responseMessage.success == true) {
                    var parentNode = tree.getSelectionModel().getSelection()[0];
                    var rootNode = tree.getRootNode();
                    if(children.itemMaterial.childrenSize == 0){
                        children.leaf = true;
                    }else{
                        children.leaf = false;
                    }
                    children.editable = true;
                    children.nodeId = me.generateUUID();
                    //parentNode.remove();
                    //rootNode.appendChild(children);
                    if(!Ext.isEmpty(parentNode)){
                        rootNode.replaceChild(children,parentNode);
                    }
                }else {
                    Ext.Msg.alert("提示", "请求错误:" + responseMessage.message);
                };
            },
            failure: function () {
                Ext.Msg.alert("提示", "请求服务器错误！");
            }
        })
    },
    /**
     * 节点右键触发函数，可对节点进行删除操作
     * @param {Ext.tree.Panel} view 显示bom结构的panel
     * @param {Ext.data.Model} record 节点信息
     * @param {EventObject} e 事件对象
     */
    bomItemEventMenu: function(view,record,e){
        var me = this;
        me.showBomMaterialInfo(view,record);
        e.stopEvent();
        var materialId = record.get('itemMaterial').id;
        var customAttributes = [];
        Ext.Ajax.request({
            url: adminPath + 'api/admin/bom/schema/materials/'+materialId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success == true) {
                    customAttributes = responseMessage.data.customAttributes;
                }else {
                    Ext.Msg.alert("提示", "请求错误:" + responseMessage.message);
                }
                ;
            },
            failure: function () {
                Ext.Msg.alert("提示", "请求服务器错误！");
            }
        });
        var menu = Ext.create('Ext.menu.Menu',{
            record: record,
            items: [{
                text: i18n.getKey('delete'),
                itemId: 'delete',
                hidden: !record.get('editable'),
                handler: function(){
                    var bomItemId = record.get('id');
                    Ext.Ajax.request({
                        url: adminPath + 'api/admin/bom/schema/bomItems/'+bomItemId,
                        method: 'DELETE',
                        headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                        success: function (res) {
                            var responseMessage = Ext.JSON.decode(res.responseText);
                            if (responseMessage.success == true) {
                                var parentNode = view.getSelectionModel().getSelection()[0];
                                parentNode.remove();
                                me.bomPanel.content.getComponent('bomInfoPanel').removeAll();
                                Ext.Msg.alert('提示','删除成功！');
                            }else {
                                Ext.Msg.alert("提示", "请求错误:" + responseMessage.message);
                            }
                            ;
                        },
                        failure: function () {
                            Ext.Msg.alert("提示", "请求服务器错误！");
                        }
                    })
                }
            }]
        });
        if(record.get('editable')){
            menu.showAt(e.getXY());
        }

    },
    /**
     * 查看物料的Bom结构
     * @param { Number} materialId 物料ID
     * @param {Number} id Bom结构ID
     * @param {string} bomName BOM的名字
     * @param {string} itemMaterialName 物料名称
     */
    checkBomItem: function(materialId,id,bomName,itemMaterialName){
        var me = this;
        //var bomInfo = me.showBomPanel(me.data).content;
        var checkBomItemWin = Ext.getCmp('checkBomItemWin');
        var treePanel = me.bomPanel.content.getComponent('bomTreePanel');
        if(checkBomItemWin){

        }else {
            checkBomItemWin = Ext.create('Ext.window.Window', {
                modal: true,
                title:i18n.getKey('checkBomItem'),
                id: 'checkBomItemWin',
                width: Ext.getBody().getWidth(),
                height: Ext.getBody().getHeight(),
                defaults: {
                    split: true,
                    hideCollapseTool: true
                },
                /*listeners: {
                    beforeclose: function (win) {
                        Ext.Ajax.request({
                            url: adminPath + 'api/admin/bom/schema/materials/' + me.data.id + '/children' ,
                            method: 'GET',
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (res) {
                                var responseMessage = Ext.JSON.decode(res.responseText);
                                var children = responseMessage.data;
                                Ext.Array.each(children, function (item) {
                                    if (item.itemMaterial.childrenSize == 0) {
                                        item.leaf = true
                                    } else {
                                        item.leaf = false
                                    }
                                    item.editable = true,
                                        item.nodeId = me.generateUUID();
                                });
                                win.getComponent('bomTreePanel').view.getTreeStore().on('datachanged',function(){
                                    var bomInfoPanel = me.bomPanel.content.getComponent('bomInfoPanel');
                                    treePanel.getRootNode().removeAll();
                                    delete treePanel.getRootNode().data.children;
                                    treePanel.getRootNode().appendChild(children);
                                    bomInfoPanel.removeAll();
                                });
                            }
                        });
                    }
                },*/
                layout: 'border'
            });
        }

        var bomTreePanel;
        var bomInfoPanel = Ext.create("Ext.panel.Panel",{
            region: 'center',
            title: i18n.getKey('bomInformation'),
            itemId: 'bomInfoPanel',
            layout: 'fit'
        });
        Ext.Ajax.request({
            url: adminPath + 'api/admin/bom/schema/materials/' + materialId + '/children',
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var children = responseMessage.data;
                Ext.Array.each(children, function (item) {
                    if(item.itemMaterial.childrenSize == 0){
                        item.leaf = true
                    }else{
                        item.leaf = false
                    }
                    item.editable = true,
                        item.nodeId = me.generateUUID();
                });
                bomTreePanel = Ext.create("CGP.bommaterial.edit.module.bom.BomTreePanel", {
                    controller: me,
                    itemId: 'bomTreePanel',
                    parentMaterialId: materialId,
                    children: children
                });

                checkBomItemWin.removeAll();
                //view.onRender();
                checkBomItemWin.add([bomTreePanel,bomInfoPanel]);
                checkBomItemWin.setTitle(i18n.getKey('checkBomItem')+'('+"<font color=black>"+'BOM:'+bomName+',Id:'+id+';'+i18n.getKey('itemMaterial')+':'+itemMaterialName+',Id:'+materialId+"</font>"+')')
                checkBomItemWin.show();
                me.refreshBomTreePanel(checkBomItemWin);
            }
        });
    },
    /**
     * 查看物料自定义属性
     * @param {Number} materialId 物料ID
     */
    checkCusAttri: function(materialId){
        var me = this;
        var customAttributes = [];
        Ext.Ajax.request({
            url: adminPath + 'api/admin/bom/schema/materials/'+materialId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success == true) {
                    var data = responseMessage.data;
                    Ext.create("CGP.bommaterial.edit.module.bom.CheckCusAttri",{
                        data: data,
                        controller: me
                    }).show();
                }else {
                    Ext.Msg.alert("提示", "请求错误:" + responseMessage.message);
                }
                ;
            },
            failure: function () {
                Ext.Msg.alert("提示", "请求服务器错误！");
            }
        });
    },
    /**
     * 在子物料Bom结构查看后，如果数据有修改则刷新bomTreePanel的数据
     * @param {Ext.window.Windoe} checkBomItemWin
     */
    refreshBomTreePanel: function(checkBomItemWin){
        var me = this;
        var treePanel = me.bomPanel.content.getComponent('bomTreePanel');
        Ext.Ajax.request({
            url: adminPath + 'api/admin/bom/schema/materials/' + me.data.id + '/children' ,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                var children = responseMessage.data;
                Ext.Array.each(children, function (item) {
                    if (item.itemMaterial.childrenSize == 0) {
                        item.leaf = true
                    } else {
                        item.leaf = false
                    }
                    item.editable = true,
                        item.nodeId = me.generateUUID();
                });
                checkBomItemWin.getComponent('bomTreePanel').view.getTreeStore().on('datachanged',function(){
                    var bomInfoPanel = me.bomPanel.content.getComponent('bomInfoPanel');
                    treePanel.getRootNode().removeAll();
                    delete treePanel.getRootNode().data.children;
                    treePanel.getRootNode().appendChild(children);
                    bomInfoPanel.removeAll();
                });
            }
        });
    }

})