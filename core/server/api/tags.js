// # Tag API
// RESTful API for the Tag resource
var Promise = require('bluebird'),
    _ = require('lodash'),
    pipeline = require('../lib/promise/sequential'),
    localUtils = require('./utils'),
    models = require('../models'),
    common = require('../lib/common'),
    docName = 'tags',
    allowedIncludes = ['count.posts'],
    tags;

/**
 * ### Tags API Methods
 *
 * **See:** [API Methods](constants.js.html#api%20methods)
 */
tags = {
    /**
     * ## Browse
     * @param {{context}} options
     * @returns {Promise<Tags>} Tags Collection
     */
    browse: function browse(options) {
        var tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function doQuery(options) {
            options.response = models.Tag.findPage(options);
            return options.response;
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {opts: localUtils.browseDefaultOptions}),
            localUtils.handlePublicPermissions(docName, 'browse'),
            localUtils.convertOptions(allowedIncludes),
            doQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    },

    /**
     * ## Read
     * @param {{id}} options
     * @return {Promise<Tag>} Tag
     */
    read: function read(options) {
        var attrs = ['id', 'slug', 'visibility'],
            tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function doQuery(options) {
            options.response = models.Tag.findOne(options.data, _.omit(options, ['data']))
                .then(function onModelResponse(model) {
                    if (!model) {
                        return Promise.reject(new common.errors.NotFoundError({
                            message: common.i18n.t('errors.api.tags.tagNotFound')
                        }));
                    }

                    return {
                        tags: [model.toJSON(options)]
                    };
                });
            return options.response;
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {attrs: attrs}),
            localUtils.handlePublicPermissions(docName, 'read'),
            localUtils.convertOptions(allowedIncludes),
            doQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    },

    /**
     * ## Add
     * @param {Tag} object the tag to create
     * @returns {Promise(Tag)} Newly created Tag
     */
    add: function add(options) {
        var tasks;

        /**
         * ### Model Query
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function doQuery(options) {
            options.response = models.Tag.add(options.data.tags[0], _.omit(options, ['data']))
                .then(function onModelResponse(model) {
                    return {
                        tags: [model.toJSON(options)]
                    };
                });
            return options.response;
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName),
            localUtils.handlePermissions(docName, 'add'),
            localUtils.convertOptions(allowedIncludes),
            doQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    },

    /**
     * ## Edit
     *
     * @public
     * @param {{id, context, include}} options
     * @return {Promise<Tag>} Edited Tag
     */
    edit: function edit(options) {
        var tasks;

        /**
         * Make the call to the Model layer
         * @param {Object} options
         * @returns {Object} options
         */
        function doQuery(options) {
            options.response = models.Tag.edit(options.data.tags[0], _.omit(options, ['data']))
                .then(function onModelResponse(model) {
                    if (!model) {
                        return Promise.reject(new common.errors.NotFoundError({
                            message: common.i18n.t('errors.api.tags.tagNotFound')
                        }));
                    }

                    return {
                        tags: [model.toJSON(options)]
                    };
                });
            return options.response;
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {opts: localUtils.idDefaultOptions}),
            localUtils.handlePermissions(docName, 'edit'),
            localUtils.convertOptions(allowedIncludes),
            doQuery
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    },

    /**
     * ## Destroy
     *
     * @public
     * @param {{id, context}} options
     * @return {Promise}
     */
    destroy: function destroy(options) {
        var tasks;

        /**
         * ### Delete Tag
         * Make the call to the Model layer
         * @param {Object} options
         */
        function deleteTag(options) {
            options.response = models.Tag.destroy(options).return(null);
            return options.response;
        }

        // Push all of our tasks into a `tasks` array in the correct order
        tasks = [
            localUtils.validate(docName, {opts: localUtils.idDefaultOptions}),
            localUtils.handlePermissions(docName, 'destroy'),
            localUtils.convertOptions(allowedIncludes),
            deleteTag
        ];

        // Pipeline calls each task passing the result of one to be the arguments for the next
        return pipeline(tasks, options);
    }
};

module.exports = tags;
