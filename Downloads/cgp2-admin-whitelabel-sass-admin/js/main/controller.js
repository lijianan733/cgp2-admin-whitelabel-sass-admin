function showTab(id, title, url, refresh, invoker) { // 在tabs中加载窗口
    title = decodeURI(title);
    var tabs = Ext.getCmp("tabs");
    var tab = tabs.getComponent(id);
    if (!tab) {
        tab = tabs.add({
            id: id,
            title: title,
            origin: origin,
            html: '<iframe id="tabs_iframe_' + id + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: true
        });
        tab.url = url;
    } else {
        url = url ? url : tab.url;
        title = title != '加载中...' ? title : tab.title;
        if (refresh || tab.url != url) {
            tab.update('<iframe id="tabs_iframe_' + id + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
            // Ext.getDom('tabs_iframe_' + tab.id).setAttribute("src", url);
            tab.setTitle(title);
        }
        tab.url = url;
        if (invoker)
            invoker();
    }
    //初始化title

    tabs.setActiveTab(tab);
    return tab;
};

function onTreeItemClick(me, record, item, index, e, opts) {
    var title = record.get('text');


    if (record.parentNode.get("id") == 94) {
        title = i18n.getKey('productionManager') + " " + record.get('text');
    } else if (record.parentNode.get("id") == 4) {
        title = i18n.getKey('order') + " " + record.get('text');
    } else if (record.parentNode.get("id") == 123) {
        title = i18n.getKey('orderItemManager') + " " + record.get('text');
    } else if (record.parentNode.get('id') == 247458) {
        title = i18n.getKey('finishedProductItemManager') + " " + record.get('text');
    } else if (record.parentNode.get('id') == 247459) {
        title = i18n.getKey('manufactureOrderItems') + " " + record.get('text');
    } else if (record.parentNode.get("id") == '拼单信息处理') {
        title = i18n.getKey('拼单信息处理') + " " + record.get('text');
    }
    var id = record.get('block') + 'page';
    var url = record.raw.url;
    if (record.get("leaf")) {
        if (url.indexOf('?') != -1) {
            url = url.substring(0, url.indexOf('?')) + '.html' + url.substring(url.indexOf('?'));
        } else {
            url = url + '.html';
        }
        url = path + 'partials/' + url; // + record.raw.block + '/' + url;
        JSOpen({
            id: id,
            title: i18n.getKey(title),
            url: url,
            refresh: true
        });
    }
}

function onTreeDefaultItemClick(defaultItems) {
    if (defaultItems?.length) {
        defaultItems.forEach(item => {
            var {url, text, block} = item,
                newUrl = path + `partials/${url}.html`,
                title = i18n.getKey(text),
                newBlock = block || '',
                id = newBlock + 'page';

            JSOpen({
                id: id,
                title: title,
                url: newUrl,
                refresh: true
            });
        })
    }
}

function getAllResource() {
    var requestConfig = {
        url: adminPath + 'api/resources',
        method: 'GET',
        params: {
            type: 'CaptionRes',
            //access_token: Ext.util.Cookies.get('token'),
            locale: Ext.util.Cookies.get('lang')
        },
        async: false,
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        callback: function (options, success, response) {
            var resp = eval('(' + response.responseText + ')');
            data = resp.data;
        }
    }
    Ext.Ajax.request(requestConfig);

    var store = new Ext.data.Store({
        model: 'qpp.model.Resource',
        data: data
    });
    return store;
}

function getMultiLingualConfig() {

    var requestConfig = {
        url: adminPath + 'api/entityMultilingualConfigs',
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        params: {
            page: 1,
            limit: 1000
        },
        async: false,
        callback: function (options, success, response) {
            var resp = eval('(' + response.responseText + ')');
            multiLingualData = resp.data.content;
        }
    };
    Ext.Ajax.request(requestConfig);

    /*var store = Ext.create('Ext.data.Store',{
        fields: [{
            name: '_id',
            type: 'string',
            useNull: true
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: "com.qpp.cgp.domain.common.EntityMultilingualConfig"
        }, 'entityClass', {
            name: 'attributeNames',
            type: 'array',
            serialize: function (value) {
                if(Ext.isEmpty(value)){
                    return [];
                }else{
                    return value.split(',');
                }
            }
        }],
        proxy: {
            type: 'uxrest',
            url: adminPath + 'api/entityMultilingualConfigs',
            reader: {
                type: 'json',
                root: 'data.content'
            }
        },
        autoLoad: true
    });*/
    var store = new Ext.data.Store({
        fields: [
            {
                name: '_id',
                type: 'string',
                useNull: true
            },
            {
                name: 'clazz',
                type: 'string',
                defaultValue: "com.qpp.cgp.domain.common.EntityMultilingualConfig"
            },
            'entityClass',
            {
                name: 'attributeNames',
                type: 'array',
                serialize: function (value) {
                    if (Ext.isEmpty(value)) {
                        return [];
                    } else {
                        return value.split(',');
                    }
                }
            }
        ],
        data: multiLingualData
    });
    return store;
}

/*function getWebsiteMode(){

    var requestConfig = {
        url: adminPath + 'api/applicationMode',
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        async: false,
        callback: function (options, success, response) {
            var resp = eval('(' + response.responseText + ')');
            websiteMode = resp.data;
        }
    };
    Ext.Ajax.request(requestConfig);
    return websiteMode;
}
getWebsiteMode();*/
/**
 * 将支持的locale存放到到cookie
 */
function reloadLocales() {

    Ext.Ajax.request({
        method: 'GET',
        url: adminPath + 'api/languages?page=1&limit=50',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        success: function (resp) {
            var locales = [];
            locales.push('default');
            var langs = Ext.JSON.decode(resp.responseText).data.content;
            for (var i = 0; i < langs.length; i++) {
                if (!Ext.isEmpty(langs[i].locale))
                    locales.push(langs[i].code.code + "_" + langs[i].locale.code);
                else
                    locales.push(langs[i].code.code);
            }
            Ext.util.Cookies.set('locales', locales);
        }
    });
};

if (Ext.isEmpty(Ext.util.Cookies.get('lang'))) {
    Ext.util.Cookies.set('lang', 'zh')
}
;
reloadLocales();

////i18n资源包
var resStore = getAllResource();
//多语言配置包
var multilingualCfgStore = getMultiLingualConfig();

function onConfigClick(a, b, c, d) {
    var url = path + 'admin/' + this.targetPath;
    var title = this.text;
    var id = this.targetPath + 'page';
    JSOpen({
        layout: 'fit',
        id: id,
        title: title,
        url: url
    });
}

function onAboutClick() {
    alert('Customization Marketing System version:0.1');
}

function adminModifyPasswordWin() {
    var me = this;
    Ext.create('CGP.main.ModifyPassword', {
        controller: me
    }).show();
}

function modifyAdminPassword(data, win) {
    if (data['confirmPwd'] != data['newPassword']) {
        win.form.getComponent('confirmPwd').markInvalid('密码输入不一致！');
    } else {
        var loadMask = win.setLoading(true);
        Ext.Ajax.request({
            url: adminPath + 'api/admin/user/password',
            jsonData: {'currentPassword': data['currentPassword'], 'newPassword': data['newPassword']},
            method: 'PUT',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                loadMask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success == true) {
                    Ext.Msg.alert('提示', '修改成功！');
                } else {
                    Ext.Msg.alert('提示', '修改失败，错误信息:' + response.data.message);
                }
            },
            failure: function (resp) {
                loadMask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }
}