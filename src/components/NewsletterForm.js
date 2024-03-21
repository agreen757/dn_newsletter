// Step 5 & 6: Create a form in NewsletterForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import textfield and button from material-ui
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ReactQuill from 'react-quill';
//import a dropdown with features from material-ui
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
//import a form control from material-ui
import FormControl from '@mui/material/FormControl';
//import autocomplete from material-ui
import Autocomplete from '@mui/material/Autocomplete';
import 'react-quill/dist/quill.snow.css'; // import styles
//import a grid from material-ui
import Grid from '@mui/material/Grid';
//import checkbox form control
import Checkbox from '@mui/material/Checkbox';


//useffect will make an api call



const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [greating, setGreating] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [sendAll, setSendAll] = useState(false);
  const [testing, setTesting] = useState(false);

  //array of months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'
  ];
  //array of years
  const years = [
    '2021', '2022', '2023', '2024', '2025'
  ];
  useEffect(() => {
    const fetchData = async () => {
        //
      try {
        const response = await axios.get('https://cjed05n28l.execute-api.us-east-1.amazonaws.com/staging/dn_partner_list_korrect');

        console.log(response);
        let items = response.data.body;//filter all items that have a blank or empty displayName value
        items = items.filter(item => item.displayName !== '');//remove duplicates from items
        items = items.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.displayName === item.displayName
          ))
        );//remove duplicate emails from items
        items = items.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.creator.email === item.creator.email
          ))
        );
        setEmailList(items); 
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [])



  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']                                         // remove formatting button
    ],
  };

  const sendEmail = async (email) => {
    //return promise
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post('https://cjed05n28l.execute-api.us-east-1.amazonaws.com/staging/send-mail', {
          message_body: content,
          message_greeting: greating,
          subject: subject,
          template: 'general-message',
          //text is content w/o html tags
          text: content.replace(/<[^>]*>?/gm, ''),
          recipient: email
        });
        resolve(response);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //check if there are empty fields
    console.log(email, content, subject, greating)
    if (!email && !testing || !content || !subject || !greating) {
      alert('All fields are required');
      return;
    }

    //check if the checkbox is checked, if it is, send to all emails in the list waiting for the response of each email
    if (sendAll) {
      for (let i = 0; i < emailList.length; i++) {
        await sendEmail(emailList[i].creator.email);
      }
    }
    //check if test mode is checked, if it is, change the email to 'adrian@distro-nation.com
    if (testing) {
      setEmail('adrian@distro-nation.com')
    }
    try {
        const response = await axios.post('https://cjed05n28l.execute-api.us-east-1.amazonaws.com/staging/send-mail', {
            
             
                message_body: content,
                message_greeting: greating,
                subject: subject,
                template: 'general-message',
                //text is content w/o html tags
                text: content.replace(/<[^>]*>?/gm, ''),
                recipient: email
            
        });

      //window.location.href = '/confirmation';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <h1>Distro Nation Newsletter</h1>
    
    <form onSubmit={handleSubmit}>
    <Grid container spacing={15} justifyContent='space-between' alignItems={'center'}>
        <Grid item xl={10}>
          <Grid container direction={'row'} spacing={2}>
     
            <Grid item xs={5}>
                <TextField
                id="subject"
                label="Subject"
                variant="outlined"
                value={subject}
                onChange={(e) => setSubject(e.target.value)} />
            </Grid>
            <Grid item xs={5}>
              <TextField
                id="greating"
                label="Greating"
                variant="outlined"
                value={greating}
                onChange={(e) => setGreating(e.target.value)} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xl={2} alignContent={'right'}>
          <Grid container spacing={15} justifyContent='space-between' alignItems={'center'}>
            
            <Grid item xl={3} alignContent={'right'}>
            <FormControl className='checkbox' style={{width: '100px', textAlign: 'center'}}>
                <Checkbox
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  checked={testing}
                  onChange={(e) => setTesting(e.target.checked)}
                />
                <label>Test-Mode</label>
              </FormControl>
              <FormControl style={{width: '100px', textAlign: 'center'}}>
                <Checkbox
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  checked={sendAll}
                  onChange={(e) => setSendAll(e.target.checked)}
                />
                <label>Send to all</label>
              </FormControl>
              <FormControl>
                  <Autocomplete
                      id="email"
                      options={emailList}
                      getOptionLabel={(option) => option.name}
                      style={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Email" variant="outlined" />}
                      onChange={(e, value) => setEmail(value.creator?value.creator.email:'')}
                  />
              </FormControl>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} style={{ height: '250px' }} />
    <div style={{marginTop:'50px'}}>
    <Button variant="contained" type="submit">Send</Button>

    </div>
    </form>
    </>
  );
}

export default NewsletterForm;