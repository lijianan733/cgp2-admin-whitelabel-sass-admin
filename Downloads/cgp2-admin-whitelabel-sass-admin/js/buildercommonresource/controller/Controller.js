/**
 * Created by nan on 2020/10/29
 */
Ext.define('CGP.buildercommonresource.controller.Controller', {
    /**
     * 对共用资源中某一项进行操作
     * @param resourceType
     * @param operationType
     * @param ids
     */
    operateResource: function (resourceType, method, ids, grid, async) {
        if (Ext.isEmpty(async)) {
            async = true;
        }
        var successMsg = null;
        var url = '';
        var version = 'V2';
        var callBack = function () {
        };
        var mapping = {
            'font': 'api/commonbuilderresourceconfigs/' + version + '/fonts',
            'fontColor': 'api/commonbuilderresourceconfigs/' + version + '/fontColors',
            'backgroundColor': 'api/commonbuilderresourceconfigs/' + version + '/backgroundColors',
            'fontFilters': 'api/commonbuilderresourceconfigs/' + version + '/fontFilters'//这个资源只有PUT操作
        }
        if (method == 'POST') {
            url = adminPath + mapping[resourceType] + '?ids=' + ids.toString();
            successMsg = i18n.getKey('addsuccessful');
            callBack = function () {
                grid.store.load();
                grid.el.unmask();
            }
        }
        if (method == 'DELETE') {
            url = adminPath + mapping[resourceType] + '?ids=' + ids.toString();
            successMsg = i18n.getKey('deleteSuccess');
            callBack = function () {
                grid.getSelectionModel().deselectAll();
                grid.store.load();
                grid.el.unmask();
            }
        }
        grid.el.mask('加载中..');
        grid.updateLayout();
        var result = JSAjaxRequest(url, method, async, '', successMsg, callBack);
        return result;

    },
    /**
     * 添加和修改某条fontFilters
     * @param record
     * @param grid
     */
    setFontFilters: function (data, callback) {
        console.log(data);
        var successMsg = '保存成功';
        data = {
            fontFilters: data
        };
        var url = adminPath + 'api/commonbuilderresourceconfigs/V2/fontFilters';
        JSAjaxRequest(url, 'PUT', false, data, successMsg, callback);

    },
    /**
     * 获取字体的过滤规则
     * @returns {string|null}
     */
    getFontFilters: function () {
        var url = adminPath + 'api/commonbuilderresourceconfigs/V2/fontFilters';
        var result = JSAjaxRequest(url, 'GET', false, null, null, function () {
        });
        return result;
    },
    saveBGSizeDifference: function (data, grid) {
        var url = adminPath + 'api/commonbuilderresourceconfigs/V2/bgSizeDifference';
        JSAjaxRequest(url, 'PUT', false, data, 'saveSuccess', function (require, success, response) {
            grid.store.load();
        })
    }
})
