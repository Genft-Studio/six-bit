import {useEffect} from "react";
import {UserStorage} from "@spacehq/storage";
import _ from "lodash";

function TestSpaceSDK(props) {

    const uploadFile = async () => {
        const spaceStorage = new UserStorage(props.spaceUser);

        const response = await spaceStorage.addItems({
            bucket: 'personal',
            files: [
                {
                    path: 'file.txt',
                    content: '',
                    mimeType: 'plain/text',
                },
                {
                    path: 'space.png',
                    content: '',
                    mimeType: 'image/png',
                }
            ],
        });

        response.on('data', (data) => {
            const status = data
            // update event on how each file is uploaded
        });

        response.on('error', (err) => {
            const status = err
            // error event if a file upload fails
            // status.error contains the error
        });

        response.once('done', (data) => {
            const summary = data
            // returns a summary of all files and their upload status
        });
        /*
        response.on('data', (data: AddItemsEventData) => {
            const status = data
            as
            AddItemsStatus;
            // update event on how each file is uploaded
        });

        response.on('error', (err: AddItemsEventData) => {
            const status = data
            as
            AddItemsStatus;
            // error event if a file upload fails
            // status.error contains the error
        });

        response.once('done', (data: AddItemsEventData) => {
            const summary = data
            as
            AddItemsResultSummary;
            // returns a summary of all files and their upload status
        });

         */
    }

    const handleDoStuff = () => {
        console.log("Doing stuff...")
        console.log("spaceStorage: ", props.spaceStorage)
        uploadFile()
    }

    useEffect(() => {
        console.log("READY")
        // uploadFile()
    }, [])

    useEffect(() => {
        console.log("spaceStorage updated")
        console.log("spaceStorage: ", props.spaceStorage)
        if(!_.isEmpty(props.spaceStorage)) {
            /*
            console.log("About to try uploading file")
            uploadFile()

            readStorage().then(ls => {
                // Read spaceStorage from Fleek
                // console.log("ls", ls)
                if(_.isEmpty(ls.items)) {
                    console.log("SpaceStorage is empty, creating initial folder")
                    createFolder("My Art")
                }
            })

             */
        }
    }, [props.spaceStorage])


    return (
        <>
            <p>Happy little test case</p>
            <button onClick={handleDoStuff}>Do Stuff!</button>
        </>
    )
}

export default TestSpaceSDK