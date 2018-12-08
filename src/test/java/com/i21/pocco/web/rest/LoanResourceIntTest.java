package com.i21.pocco.web.rest;

import com.i21.pocco.LoanCalcApp;

import com.i21.pocco.domain.Loan;
import com.i21.pocco.repository.LoanRepository;
import com.i21.pocco.service.LoanService;
import com.i21.pocco.service.dto.LoanDTO;
import com.i21.pocco.service.mapper.LoanMapper;
import com.i21.pocco.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


import static com.i21.pocco.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the LoanResource REST controller.
 *
 * @see LoanResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LoanCalcApp.class)
public class LoanResourceIntTest {

    private static final Long DEFAULT_LOAN_ID = 1L;
    private static final Long UPDATED_LOAN_ID = 2L;

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_PRINCIPAL = "AAAAAAAAAA";
    private static final String UPDATED_PRINCIPAL = "BBBBBBBBBB";

    private static final Long DEFAULT_AMOUNT = 1L;
    private static final Long UPDATED_AMOUNT = 2L;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private LoanMapper loanMapper;

    @Autowired
    private LoanService loanService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLoanMockMvc;

    private Loan loan;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LoanResource loanResource = new LoanResource(loanService);
        this.restLoanMockMvc = MockMvcBuilders.standaloneSetup(loanResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Loan createEntity(EntityManager em) {
        Loan loan = new Loan()
            .loanId(DEFAULT_LOAN_ID)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .principal(DEFAULT_PRINCIPAL)
            .amount(DEFAULT_AMOUNT);
        return loan;
    }

    @Before
    public void initTest() {
        loan = createEntity(em);
    }

    @Test
    @Transactional
    public void createLoan() throws Exception {
        int databaseSizeBeforeCreate = loanRepository.findAll().size();

        // Create the Loan
        LoanDTO loanDTO = loanMapper.toDto(loan);
        restLoanMockMvc.perform(post("/api/loans")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(loanDTO)))
            .andExpect(status().isCreated());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeCreate + 1);
        Loan testLoan = loanList.get(loanList.size() - 1);
        assertThat(testLoan.getLoanId()).isEqualTo(DEFAULT_LOAN_ID);
        assertThat(testLoan.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testLoan.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testLoan.getPrincipal()).isEqualTo(DEFAULT_PRINCIPAL);
        assertThat(testLoan.getAmount()).isEqualTo(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    public void createLoanWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = loanRepository.findAll().size();

        // Create the Loan with an existing ID
        loan.setId(1L);
        LoanDTO loanDTO = loanMapper.toDto(loan);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLoanMockMvc.perform(post("/api/loans")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(loanDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkLoanIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = loanRepository.findAll().size();
        // set the field null
        loan.setLoanId(null);

        // Create the Loan, which fails.
        LoanDTO loanDTO = loanMapper.toDto(loan);

        restLoanMockMvc.perform(post("/api/loans")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(loanDTO)))
            .andExpect(status().isBadRequest());

        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLoans() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        // Get all the loanList
        restLoanMockMvc.perform(get("/api/loans?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(loan.getId().intValue())))
            .andExpect(jsonPath("$.[*].loanId").value(hasItem(DEFAULT_LOAN_ID.intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].principal").value(hasItem(DEFAULT_PRINCIPAL.toString())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.intValue())));
    }
    
    @Test
    @Transactional
    public void getLoan() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        // Get the loan
        restLoanMockMvc.perform(get("/api/loans/{id}", loan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(loan.getId().intValue()))
            .andExpect(jsonPath("$.loanId").value(DEFAULT_LOAN_ID.intValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.principal").value(DEFAULT_PRINCIPAL.toString()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingLoan() throws Exception {
        // Get the loan
        restLoanMockMvc.perform(get("/api/loans/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLoan() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        int databaseSizeBeforeUpdate = loanRepository.findAll().size();

        // Update the loan
        Loan updatedLoan = loanRepository.findById(loan.getId()).get();
        // Disconnect from session so that the updates on updatedLoan are not directly saved in db
        em.detach(updatedLoan);
        updatedLoan
            .loanId(UPDATED_LOAN_ID)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .principal(UPDATED_PRINCIPAL)
            .amount(UPDATED_AMOUNT);
        LoanDTO loanDTO = loanMapper.toDto(updatedLoan);

        restLoanMockMvc.perform(put("/api/loans")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(loanDTO)))
            .andExpect(status().isOk());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
        Loan testLoan = loanList.get(loanList.size() - 1);
        assertThat(testLoan.getLoanId()).isEqualTo(UPDATED_LOAN_ID);
        assertThat(testLoan.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLoan.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testLoan.getPrincipal()).isEqualTo(UPDATED_PRINCIPAL);
        assertThat(testLoan.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    public void updateNonExistingLoan() throws Exception {
        int databaseSizeBeforeUpdate = loanRepository.findAll().size();

        // Create the Loan
        LoanDTO loanDTO = loanMapper.toDto(loan);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoanMockMvc.perform(put("/api/loans")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(loanDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteLoan() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        int databaseSizeBeforeDelete = loanRepository.findAll().size();

        // Get the loan
        restLoanMockMvc.perform(delete("/api/loans/{id}", loan.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Loan.class);
        Loan loan1 = new Loan();
        loan1.setId(1L);
        Loan loan2 = new Loan();
        loan2.setId(loan1.getId());
        assertThat(loan1).isEqualTo(loan2);
        loan2.setId(2L);
        assertThat(loan1).isNotEqualTo(loan2);
        loan1.setId(null);
        assertThat(loan1).isNotEqualTo(loan2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(LoanDTO.class);
        LoanDTO loanDTO1 = new LoanDTO();
        loanDTO1.setId(1L);
        LoanDTO loanDTO2 = new LoanDTO();
        assertThat(loanDTO1).isNotEqualTo(loanDTO2);
        loanDTO2.setId(loanDTO1.getId());
        assertThat(loanDTO1).isEqualTo(loanDTO2);
        loanDTO2.setId(2L);
        assertThat(loanDTO1).isNotEqualTo(loanDTO2);
        loanDTO1.setId(null);
        assertThat(loanDTO1).isNotEqualTo(loanDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(loanMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(loanMapper.fromId(null)).isNull();
    }
}
