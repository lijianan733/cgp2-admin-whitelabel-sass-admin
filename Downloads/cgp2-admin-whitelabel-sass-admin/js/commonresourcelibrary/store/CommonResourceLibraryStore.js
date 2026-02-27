/**
 * Created by nan on 2020/4/27.
 */
Ext.define('CGP.commonresourcelibrary.store.CommonResourceLibraryStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.commonresourcelibrary.model.CommonResourceLibraryModel'],
    model: 'CGP.commonresourcelibrary.model.CommonResourceLibraryModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/businessLibraryOfCommons',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
