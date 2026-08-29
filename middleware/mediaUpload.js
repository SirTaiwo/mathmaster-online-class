const multer =
    require("multer");

const path =
    require("path");


// ========================================
// MEDIA STORAGE
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
    "../private/media/recordings"
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
// AUDIO / VIDEO VALIDATION
// ========================================

const fileFilter =
    function (
        req,
        file,
        cb
    ) {

        const allowedTypes = [

            "audio/webm",
            "audio/ogg",
            "audio/mp4",
            "audio/mpeg",

            "video/webm",
            "video/mp4",
            "video/ogg"

        ];


      const baseMimeType =
    file.mimetype.split(";")[0];


const extension =
    path.extname(
        file.originalname
    ).toLowerCase();


const isAllowedMimeType =
    allowedTypes.includes(
        baseMimeType
    );


const isAllowedWebm =
    extension === ".webm";


if (
    isAllowedMimeType ||
    isAllowedWebm
) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Only audio and video files are allowed."
                )
            );

        }

    };


// ========================================
// MULTER UPLOAD
// ========================================

const mediaUpload =
    multer({

        storage,

        fileFilter,

        limits: {

            fileSize:
                50 * 1024 * 1024

        }

    });


module.exports =
    mediaUpload;
