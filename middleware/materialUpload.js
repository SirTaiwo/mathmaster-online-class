const multer =
    require("multer");

const path =
    require("path");


// ========================================
// LEARNING MATERIAL STORAGE
// ========================================

const storage =
    multer.diskStorage({

        destination: function (
            req,
            file,
            cb
        ) {

            cb(
                null,
                path.join(
                    __dirname,
                    "../private/media/materials"
                )
            );

        },


        filename: function (
            req,
            file,
            cb
        ) {

            const extension =
                path.extname(
                    file.originalname
                ).toLowerCase();

            const filename =
                `${Date.now()}-${Math.round(
                    Math.random() * 1E9
                )}${extension}`;

            cb(
                null,
                filename
            );

        }

    });


// ========================================
// LEARNING MATERIAL VALIDATION
// ========================================

const fileFilter =
    function (
        req,
        file,
        cb
    ) {

        const allowedTypes = [

            // PDF
            "application/pdf",

            // Microsoft Word
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            // Microsoft PowerPoint
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",

            // Microsoft Excel
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            // Images
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",

            // Plain text
            "text/plain"

        ];


        const baseMimeType =
            file.mimetype.split(";")[0];


        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();


        const allowedExtensions = [

            ".pdf",
            ".doc",
            ".docx",
            ".ppt",
            ".pptx",
            ".xls",
            ".xlsx",
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp",
            ".txt"

        ];


        const isAllowedMimeType =
            allowedTypes.includes(
                baseMimeType
            );


        const isAllowedExtension =
            allowedExtensions.includes(
                extension
            );


        if (
            isAllowedMimeType &&
            isAllowedExtension
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "This file type is not supported as a learning material."
                )
            );

        }

    };


// ========================================
// MULTER UPLOAD
// ========================================

const materialUpload =
    multer({

        storage,

        fileFilter,

        limits: {

            fileSize:
                25 * 1024 * 1024

        }

    });


module.exports =
    materialUpload;
