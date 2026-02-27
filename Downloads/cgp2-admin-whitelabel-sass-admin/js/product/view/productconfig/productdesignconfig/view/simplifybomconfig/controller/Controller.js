Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.controller.Controller', {
    editSMVT: function (record, store, editOrNew, productConfigDesignId, productBomConfigId, sbomNode) {
        var me = this;
        var sbomNodeId = sbomNode._id;
        var simplifyBomConfig = null;
        var filterData = Ext.JSON.encode([{
            "name": "productConfigDesignId",
            "type": "number",
            "value": productConfigDesignId
        }]);
        /*  Ext.Ajax.request({
              url: encodeURI(adminPath + 'api/simplifyBomController?page=1&start=0&limit=25&filter=' + filterData),
              method: 'GET',
              headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
              async: false,
              success: function (rep) {
                  var response = Ext.JSON.decode(rep.responseText);
                  if (response.success) {
                      var data = response.data;
                      if (Ext.isEmpty(data)) {
                          simplifyBomConfig = null;
                      } else {
                          simplifyBomConfig =  data.content[0];
                      }
                  } else {
                      Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                  }
              },
              failure: function (resp) {
                  var response = Ext.JSON.decode(resp.responseText);
                  Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
              }
          });
          Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.Edit', {
              store: store,
              record: record,
              productBomConfigId: productBomConfigId,
              controller: me,
              productConfigDesignId: productConfigDesignId,
              editOrNew: editOrNew,
              sbomNode: sbomNode,
              simplifyBomConfig: simplifyBomConfig
          }).show();*/
    },
    deleteSMVT: function (recordId, store, sbomNode, simplifyBomConfig) {
        var me = this;
        Ext.Msg.confirm('提示', '是否删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/simplifyMaterialViewType/' + recordId,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var success = response.success;
                        if (success) {

                            store.load({
                                scope: this,
                                callback: function (records, operation, success) {
                                    var smvtArr = [];
                                    Ext.Array.each(records, function (item) {
                                        smvtArr.push({
                                            _id: item.getId(),
                                            clazz: item.get('clazz')
                                        })
                                    });
                                    simplifyBomConfig.simplifyMaterialViewTypes = smvtArr;
                                    me.saveSimplifyBomConfig('modify', simplifyBomConfig);
                                }
                            });

                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    },
    updataSMVT: function (data) {
        Ext.Ajax.request({
            url: adminPath + 'api/simplifyMaterialViewType/' + data._id,
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    Ext.Msg.alert('提示', '保存成功！');
                } else {
                    Ext.Msg.alert('提示', '保存失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    newSMVT: function (data, sbomNode, simplifyBomConfig, productConfigDesignId, editTab) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/simplifyMaterialViewType',
            method: 'POST',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    editTab.setValue(response.data);
                    //editTab.setTitle(i18n.getKey('edit')+i18n.getKey('product')+i18n.getKey('material')+i18n.getKey('view')+i18n.getKey('type'));
                   //实际上，好像不需要手动编辑simplifyMaterialViewTypes这个数组
                    var smvtRawDataArr = me.getSMVTOfSBom(simplifyBomConfig._id);
                    var smvtArr = [];
                    Ext.Array.each(smvtRawDataArr, function (item) {
                        smvtArr.push({
                            _id: item._id,
                            clazz: item.clazz
                        })
                    });
                    if (Ext.isEmpty(simplifyBomConfig)) {
                        simplifyBomConfig = {};
                        simplifyBomConfig.simplifyMaterialViewTypes = smvtArr;
                        simplifyBomConfig.clazz = 'com.qpp.cgp.domain.simplifyBom.SimplifyBomConfig';
                        simplifyBomConfig.productConfigDesignId = productConfigDesignId;
                        simplifyBomConfig.sbom = {
                            _id: sbomNode._id,
                            clazz: sbomNode.clazz
                        }
                        me.saveSimplifyBomConfig('new', simplifyBomConfig);
                    } else {
                        simplifyBomConfig.simplifyMaterialViewTypes = smvtArr;
                        me.saveSimplifyBomConfig('modify', simplifyBomConfig);
                    }
                    Ext.Msg.alert('提示', '添加成功！');
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    saveSimplifyBomConfig: function (editOrNew, data) {
        var url = '';
        var method = '';
        if (editOrNew === 'new') {
            url = adminPath + 'api/simplifyBomController';
            method = 'POST';
        } else {
            url = adminPath + 'api/simplifyBomController/' + data._id;
            method = 'PUT';
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    checkHavaSbomNode: function (productConfigDesignId, sbomNode) {
        var me = this;

        Ext.Ajax.request({
            url: adminPath + 'api/SBNodeController/' + productConfigDesignId + '/SBNOdeTree/root/children',
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    var data = response.data;
                    if (Ext.isEmpty(data)) {
                        Ext.Msg.alert('提示', '未配置简易bom结构节点,跳转配置！', function callback() {
                        });
                    } else {
                        me.sbomNode = data[0];
                        return data[0];
                    }
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    checkHaveSimplifyBomConfig: function (productConfigDesignId) {
        var filterData = Ext.JSON.encode([{
            "name": "productConfigDesignId",
            "type": "number",
            "value": productConfigDesignId
        }]);
        Ext.Ajax.request({
            url: encodeURI(adminPath + 'api/simplifyBomController?page=1&start=0&limit=25&filter=' + filterData),
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            async: false,
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    var data = response.data;
                    if (Ext.isEmpty(data)) {
                        return null;
                    } else {
                        return data.content[0];
                    }
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    /**
     * 获取某个sbom下面所有的smvt
     */
    getSMVTOfSBom: function (sbomId) {
        var url = adminPath + 'api/simplifyMaterialViewType/findAll/' + sbomId + '?page=1&limit=100';
        var result = null;
        JSAjaxRequest(url, "GET", false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                result = responseText.data.content;
            }
        })
        return result;
    }

});
